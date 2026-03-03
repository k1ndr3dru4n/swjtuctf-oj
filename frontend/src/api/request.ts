import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { useUserStore } from '../stores/user';

// Create axios instance
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return response data directly
    return response.data;
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Token expired or invalid
        const userStore = useUserStore();
        userStore.logout();
        // Redirect to login
        window.location.href = '/login';
      }

      return Promise.reject({
        code: data?.code || status,
        msg: data?.msg || 'Request failed',
      });
    }

    return Promise.reject({
      code: -1,
      msg: error.message || 'Network error',
    });
  }
);

export default request;
