import { createAxiosInstance } from './axiosInterceptor';

const api = createAxiosInstance({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
}, {
  enableRetry: false,
});

export default api;
