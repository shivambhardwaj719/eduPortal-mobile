import api, { saveTokens, clearTokens } from './api';
import { apiPaths } from '../constants/apiPaths';
import { User, LoginCredentials, ApiResponse } from '../types';

interface LoginApiResponse {
    success: boolean;
    message: string;
    data: {
        access: string;
        refresh: string;
        user?: User;
    };
}

interface LoginResponse {
    token: string;
    refresh_token: string;
    user: User;
}

export const authService = {
    // Login
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        // Add default school_id and host if not provided
        const loginData = {
            email: credentials.email,
            password: credentials.password,
            school_id: credentials.school_id || '1',
            host: credentials.host || window?.location?.origin || 'https://app.sikshaneeti.com',
        };

        const response = await api.post<LoginApiResponse>(apiPaths.auth.login, loginData);

        if (response.data.success) {
            const { access, refresh, user } = response.data.data;
            await saveTokens(access, refresh);

            return {
                token: access,
                refresh_token: refresh,
                user: user || {} as User,
            };
        }

        throw new Error(response.data.message || 'Login failed');
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

    // Check domain - returns school info if valid
    checkDomain: async (domain: string): Promise<{
        success: boolean;
        data?: { school_id: number; school_name?: string };
        message?: string;
    }> => {
        try {
            const response = await api.get(apiPaths.auth.checkDomain, {
                params: { domain }
            });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Domain verification failed',
            };
        }
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
