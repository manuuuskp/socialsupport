import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface InterceptorConfig {
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  enableTimeout?: boolean;
  timeout?: number;
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  onResponse?: (response: AxiosResponse) => AxiosResponse;
  onError?: (error: AxiosError) => Promise<any>;
}

class AxiosInterceptorService {
  private static instance: AxiosInterceptorService;
  private retryCount = new Map<string, number>();

  private constructor() {}

  public static getInstance(): AxiosInterceptorService {
    if (!AxiosInterceptorService.instance) {
      AxiosInterceptorService.instance = new AxiosInterceptorService();
    }
    return AxiosInterceptorService.instance;
  }

  public setupInterceptors(axiosInstance: AxiosInstance, config: InterceptorConfig = {}): AxiosInstance {
    const {
      enableRetry = true,
      maxRetries = 2,
      retryDelay = 1000,
      enableTimeout = true,
      timeout = 10000,
      onRequest,
      onResponse,
      onError,
    } = config;

    if (enableTimeout && !axiosInstance.defaults.timeout) {
      axiosInstance.defaults.timeout = timeout;
    }

    axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {

        config.metadata = { startTime: Date.now() };

        if (onRequest) {
          config = onRequest(config);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      (response) => {
        const requestKey = this.getRequestKey(response.config);
        this.retryCount.delete(requestKey);

        if (onResponse) {
          response = onResponse(response);
        }

        return response;
      },
      async (error: AxiosError) => {

        if (onError) {
          try {
            return await onError(error);
          } catch (customError) {
            return Promise.reject(customError);
          }
        }

        if (enableRetry && this.shouldRetry(error)) {
          const requestKey = this.getRequestKey(error.config!);
          const currentRetryCount = this.retryCount.get(requestKey) || 0;

          if (currentRetryCount < maxRetries) {
            this.retryCount.set(requestKey, currentRetryCount + 1);
            
            const delay = retryDelay * Math.pow(2, currentRetryCount);

            await this.delay(delay);
            return axiosInstance(error.config!);
          } else {
            this.retryCount.delete(requestKey);
          }
        }

        return Promise.reject(this.enhanceError(error));
      }
    );

    return axiosInstance;
  }

  private shouldRetry(error: AxiosError): boolean {
    if (!error.config) return false;

    if (error.config.metadata?.noRetry) return false;

    if (!error.response) return true;

    if (error.response.status >= 500) return true;

    if (error.response.status === 429) return true;

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) return true;

    return false;
  }

  private getRequestKey(config: InternalAxiosRequestConfig): string {
    return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private enhanceError(error: AxiosError): AxiosError {
    if (!error.response) {
      error.message = 'Network error. Please check your internet connection.';
    } else if (error.response.status === 401) {
      error.message = 'Authentication failed. Please check your credentials.';
    } else if (error.response.status === 403) {
      error.message = 'Access denied. You do not have permission to perform this action.';
    } else if (error.response.status === 404) {
      error.message = 'The requested resource was not found.';
    } else if (error.response.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }

    return error;
  }

  public createInstance(baseConfig: AxiosRequestConfig = {}, interceptorConfig: InterceptorConfig = {}): AxiosInstance {
    const instance = axios.create(baseConfig);
    return this.setupInterceptors(instance, interceptorConfig);
  }
}

export const axiosInterceptorService = AxiosInterceptorService.getInstance();

export const createAxiosInstance = (
  baseConfig: AxiosRequestConfig = {},
  interceptorConfig: InterceptorConfig = {}
): AxiosInstance => {
  return axiosInterceptorService.createInstance(baseConfig, interceptorConfig);
};

export type { InterceptorConfig };

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime?: number;
      noRetry?: boolean;
    };
  }
}