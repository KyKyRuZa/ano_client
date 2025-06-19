import axios from 'axios';

const API_URL = 'https://anotsenimzhizn.ru/api/auth';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedRequestsQueue = [];

const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedRequestsQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedRequestsQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Нет такого пользователя');

        const res = await apiClient.post('/refresh-token', { refreshToken });
        const { token } = res.data;

        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        processQueue(null, token);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('admin');
        localStorage.removeItem('isAdmin');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  async login(login, password) {
    try {
      const res = await apiClient.post('/login', { login, password });

      if (res.data.token && res.data.admin) {
        const { token, refreshToken, admin } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('admin', JSON.stringify(admin));
        localStorage.setItem('isAdmin', 'true');

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return res.data;
      } else {
        throw new Error(res.data.error || 'Ошибка авторизации');
      }
    } catch (error) {
      const message = error.response?.data?.error ||
                      error.message ||
                      'Ошибка входа в систему';
      throw new Error(message);
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('isAdmin');
    delete apiClient.defaults.headers.common['Authorization'];
  },

  isAuthenticated() {
    return localStorage.getItem('isAdmin') === 'true';
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getCurrentAdmin() {
    try {
      const admin = localStorage.getItem('admin');
      return admin ? JSON.parse(admin) : null;
    } catch (e) {
      console.error('Ошибка чтения данных админа:', e);
      return null;
    }
  }
};

// Инициализация заголовков при загрузке
if (authApi.getToken()) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${authApi.getToken()}`;
}

export default authApi;