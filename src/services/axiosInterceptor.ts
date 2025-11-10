import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../utils/constants/errorMessages';

export interface InterceptorConfig {
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  onResponse?: (response: AxiosResponse) => AxiosResponse;
  onError?: (error: AxiosError) => Promise<any>;
}

const retryCountMap = new Map<string, number>();

function getRequestKey(config: AxiosRequestConfig) {
  return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}`;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function enhanceError(error: AxiosError) {
  if (!error.response) {
    error.message = ERROR_MESSAGES.network;
  } else if (error.response.status === 401) {
    error.message = ERROR_MESSAGES.auth;
  } else if (error.response.status === 403) {
    error.message = ERROR_MESSAGES.forbidden;
  } else if (error.response.status === 404) {
    error.message = ERROR_MESSAGES.notFound;
  } else if (error.response.status >= 500) {
    error.message = ERROR_MESSAGES.server;
  } else {
    error.message = ERROR_MESSAGES.unknown;
  }
  return error;
}

function shouldRetry(error: AxiosError): boolean {
  if (!error.config) return false;
  if ((error.config as any).noRetry) return false;

  if (error.response?.status === 401) return false;

  if (!error.response) return true;
  if (error.response.status >= 500) return true;
  if (error.response.status === 429) return true;
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) return true;

  return false;
}

export function createAxiosInstance(
  baseConfig: AxiosRequestConfig = {},
  interceptorConfig: InterceptorConfig = {}
): AxiosInstance {
  const {
    enableRetry = true,
    maxRetries = 2,
    retryDelay = 1000,
    timeout = 10000,
    onRequest,
    onResponse,
    onError,
  } = interceptorConfig;

  const instance = axios.create({ ...baseConfig, timeout });

  instance.interceptors.request.use(
    config => {
      (config as any).metadata = { startTime: Date.now() };
      if (onRequest) config = onRequest(config) as any;
      return config;
    },
    error => Promise.reject(error)
  );

  instance.interceptors.response.use(
    response => {
      const key = getRequestKey(response.config);
      retryCountMap.delete(key);

      if (onResponse) response = onResponse(response);
      return response;
    },
    async error => {
      const key = getRequestKey(error.config!);

      if (onError) {
        try {
          return await onError(error);
        } catch (customError) {
          return Promise.reject(customError);
        }
      }

      if (enableRetry && shouldRetry(error)) {
        const currentRetry = retryCountMap.get(key) || 0;
        if (currentRetry < maxRetries) {
          retryCountMap.set(key, currentRetry + 1);
          await delay(retryDelay * Math.pow(2, currentRetry));
          return instance(error.config!);
        } else {
          retryCountMap.delete(key);
        }
      }

      return Promise.reject(enhanceError(error));
    }
  );

  return instance;
}
