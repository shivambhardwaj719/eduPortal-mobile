import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { API_BASE_URL } from '../constants/apiPaths';

// Platform-aware secure storage
// Uses SecureStore on native, localStorage on web
const storage = {
    setItem: async (key: string, value: string): Promise<void> => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
        } else {
            const SecureStore = require('expo-secure-store');
            await SecureStore.setItemAsync(key, value);
        }
    },
    getItem: async (key: string): Promise<string | null> => {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        } else {
            const SecureStore = require('expo-secure-store');
            return await SecureStore.getItemAsync(key);
        }
    },
    deleteItem: async (key: string): Promise<void> => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            const SecureStore = require('expo-secure-store');
            await SecureStore.deleteItemAsync(key);
        }
    },
};

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Token management functions
export const saveTokens = async (token: string, refreshToken: string): Promise<void> => {
    await storage.setItem(TOKEN_KEY, token);
    await storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getToken = async (): Promise<string | null> => {
    return await storage.getItem(TOKEN_KEY);
};

export const getRefreshToken = async (): Promise<string | null> => {
    return await storage.getItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = async (): Promise<void> => {
    await storage.deleteItem(TOKEN_KEY);
    await storage.deleteItem(REFRESH_TOKEN_KEY);
};

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getRefreshToken();
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/refreshtokens`, {
                        refresh_token: refreshToken,
                    });

                    const { token, refresh_token } = response.data;
                    await saveTokens(token, refresh_token);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }

                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                await clearTokens();
                // Navigation will be handled by the auth state change
            }
        }

        return Promise.reject(error);
    }
);

export default api;
