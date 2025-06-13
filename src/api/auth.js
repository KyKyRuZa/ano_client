import axios from 'axios';

const API_URL = 'https://anotsenimzhizn.ru/api/auth';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const updateAuthHeaders = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    return authApi.logout();
                }

                const response = await axiosInstance.post('/refresh-token', { refreshToken });
                
                const { token, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', newRefreshToken);

                updateAuthHeaders(token);

                originalRequest.headers['Authorization'] = `Bearer ${token}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                return authApi.logout();
            }
        }

        return Promise.reject(error);
    }
);

export const authApi = {
    async register(login, password, role = 'admin') {
        try {
            const response = await axiosInstance.post('/register', {
                login,
                password,
                role
            });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken || '');
                localStorage.setItem('user', JSON.stringify(response.data.admin));
                
                updateAuthHeaders(response.data.token);
            }
            
            return response.data;
        } catch (error) {
            console.error('Registration Error:', error.response?.data || error.message);
            throw error.response?.data || new Error('Registration failed');
        }
    },

    async login(login, password) {
        try {
            const response = await axiosInstance.post('/login', {
                login,
                password
            });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken || '');
                localStorage.setItem('user', JSON.stringify(response.data.admin));
                
                updateAuthHeaders(response.data.token);
            }
            
            return response.data;
        } catch (error) {
            console.error('Login Error:', error.response?.data || error.message);
            throw error.response?.data || new Error('Login failed');
        }
    },

    async getProfile() {
        try {
            const response = await axiosInstance.get('/profile');
            return response.data;
        } catch (error) {
            console.error('Profile Fetch Error:', error.response?.data || error.message);
            throw error.response?.data || new Error('Failed to fetch profile');
        }
    },

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axiosInstance.post('/refresh-token', { refreshToken });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken || '');
                
                updateAuthHeaders(response.data.token);
            }

            return response.data;
        } catch (error) {
            console.error('Token Refresh Error:', error.response?.data || error.message);
            return this.logout();
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        
        delete axiosInstance.defaults.headers.common['Authorization'];
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

export default authApi;