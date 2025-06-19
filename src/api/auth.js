import axios from 'axios';

const API_URL = 'https://anotsenimzhizn.ru/api/auth';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 секунд таймаут
});

const updateAuthHeaders = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

// Интерцептор для автоматического обновления токенов
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    authApi.logout();
                    return Promise.reject(error);
                }

                const response = await axiosInstance.post('/refresh-token', { 
                    refreshToken 
                });
                
                if (response.data.token) {
                    const { token } = response.data;

                    localStorage.setItem('token', token);
                    updateAuthHeaders(token);

                    originalRequest.headers['Authorization'] = `Bearer ${token}`;

                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Ошибка обновления токена:', refreshError);
                authApi.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const authApi = {
    async login(login, password) {
        try {
            console.log('Отправка запроса на авторизацию...');
            
            const response = await axiosInstance.post('/login', {
                login,
                password
            });
            
            console.log('Ответ сервера:', response.data);
            
            if (response.data.token && response.data.admin) {
                const { token, admin } = response.data;
                
                // Сохраняем данные в localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('admin', JSON.stringify(admin));
                localStorage.setItem('isAdmin', 'true');
                
                // Обновляем заголовки авторизации
                updateAuthHeaders(token);
                
                return response.data;
            } else {
                throw new Error(response.data.error || 'Ошибка авторизации');
            }
        } catch (error) {
            console.error('Login Error Details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText
            });
        }
    },

    async register(login, password) {
        try {
            const response = await axiosInstance.post('/register', {
                login,
                password
            });
            
            if (response.data.token && response.data.admin) {
                const { token, admin } = response.data;
                
                // Сохраняем данные в localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('admin', JSON.stringify(admin));
                localStorage.setItem('isAdmin', 'true');
                
                // Обновляем заголовки авторизации
                updateAuthHeaders(token);
                
                return response.data;
            } else {
                throw new Error(response.data.error || 'Ошибка регистрации');
            }
        } catch (error) {
            console.error('Registration Error:', error);
        }
    },

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!refreshToken) {
                throw new Error('Refresh token не найден');
            }

            const response = await axiosInstance.post('/refresh-token', { 
                refreshToken 
            });
            
            if (response.data.token) {
                const { token } = response.data;
                
                // Обновляем токен в localStorage
                localStorage.setItem('token', token);
                
                // Обновляем заголовки авторизации
                updateAuthHeaders(token);
                
                return response.data;
            } else {
                throw new Error(response.data.error || 'Ошибка обновления токена');
            }
        } catch (error) {
            console.error('Token Refresh Error:', error);
            
            // При ошибке обновления токена - выходим из системы
            this.logout();
        }
    },

    logout() {
        // Очищаем все данные из localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('admin');
        localStorage.removeItem('isAdmin');
        
        // Удаляем заголовки авторизации
        updateAuthHeaders(null);
        
        console.log('Администратор вышел из системы');
    },

    isAuthenticated() {
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin');
        return !!(token && isAdmin === 'true');
    },

    getCurrentAdmin() {
        try {
            const adminStr = localStorage.getItem('admin');
            return adminStr ? JSON.parse(adminStr) : null;
        } catch (error) {
            console.error('Ошибка парсинга данных администратора:', error);
            return null;
        }
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }
};

// Инициализация при загрузке модуля
const initializeAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
        updateAuthHeaders(token);
        console.log('Токен авторизации восстановлен из localStorage');
    }
};

// Вызываем инициализацию
initializeAuth();

export default authApi;
