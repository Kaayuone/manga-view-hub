import { useTokenStore } from '@/stores';
import axios from 'axios';
import { authApi } from '.';

const request = axios.create({
  baseURL: '/api',
});

let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const tokenStore = useTokenStore();

request.interceptors.request.use(config => {
  if (tokenStore.hasAccessToken) {
    config.headers.Authorization = `Bearer ${tokenStore.accessToken}`;
  }
  return config;
});

request.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers!.Authorization = `Bearer ${token}`;
            return request(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data: tokens } = await authApi.refresh(tokenStore.refreshToken);
        tokenStore.setTokens(tokens);

        originalRequest.headers!.Authorization = `Bearer ${tokenStore.accessToken}`;
        const retryResponse = await request(originalRequest);

        failedRequestsQueue.forEach(({ resolve }) => resolve(tokenStore.accessToken));
        failedRequestsQueue = [];
        return retryResponse;
      } catch (refreshError: unknown) {
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default request;
