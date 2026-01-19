import api, { saveTokens, clearTokens } from './api';
import { apiPaths } from '../constants/apiPaths';
import { User, LoginCredentials, ApiResponse } from '../types';

interface LoginResponse {
    token: string;
    refresh_token: string;
    user: User;
}

export const authService = {
    // Login
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(apiPaths.auth.login, credentials);
        const { token, refresh_token, user } = response.data;
        await saveTokens(token, refresh_token);
        return response.data;
    },

    // Logout
    logout: async (): Promise<void> => {
        try {
            await api.post(apiPaths.auth.logOut);
        } catch (error) {
            console.log('Logout API error:', error);
        } finally {
            await clearTokens();
        }
    },

    // Get user profile
    getUserProfile: async (): Promise<User> => {
        const response = await api.get<ApiResponse<User>>(apiPaths.auth.userProfile);
        return response.data.data;
    },

    // Forgot password
    forgotPassword: async (email: string): Promise<void> => {
        await api.post(apiPaths.auth.forgotPassword, { email });
    },

    // Reset password
    resetPassword: async (token: string, password: string): Promise<void> => {
        await api.post(apiPaths.auth.resetPassword, { token, password });
    },

    // Check domain
    checkDomain: async (domain: string): Promise<boolean> => {
        const response = await api.post(apiPaths.auth.checkDomain, { domain });
        return response.data.valid;
    },

    // Set MPIN
    setMPIN: async (mpin: string): Promise<void> => {
        await api.post(apiPaths.auth.setMPIN, { mpin });
    },

    // Check MPIN
    checkMPIN: async (mpin: string): Promise<boolean> => {
        const response = await api.post(apiPaths.auth.checkMPIN, { mpin });
        return response.data.valid;
    },

    // Verify password
    verifyPassword: async (password: string): Promise<boolean> => {
        const response = await api.post(apiPaths.auth.verifyPassword, { password });
        return response.data.valid;
    },
};

export default authService;
