import axios from 'axios';

const API_BASE_URL = 'https://anotsenimzhizn.ru/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Логирование ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const staffApi = {
  createStaff: async (staffData) => {
    try {
      const response = await apiClient.post('/staff', staffData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Ошибка создания сотрудника');
      }
      throw error;
    }
  },

  getAllStaff: async () => {
    try {
      const response = await apiClient.get('/staff');
      return response.data;
    } catch (error) {
      console.error('Ошибка получения списка сотрудников:', error);
      throw error;
    }
  },

  getStaffById: async (id) => {
    try {
      const response = await apiClient.get(`/staff/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка получения сотрудника ${id}:`, error);
      throw error;
    }
  },

  updateStaff: async (id, staffData) => {
    try {
      const response = await apiClient.put(`/staff/${id}`, staffData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Ошибка обновления данных');
      }
      throw error;
    }
  },

  partialUpdateStaff: async (id, staffData) => {
    try {
      const formData = staffData instanceof FormData 
        ? staffData 
        : Object.entries(staffData).reduce((fd, [key, value]) => {
            if (value !== null && value !== undefined) fd.append(key, value);
            return fd;
          }, new FormData());

      const response = await apiClient.patch(`/staff/update/${id}`, formData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Ошибка частичного обновления');
      }
      throw error;
    }
  },

  deleteStaff: async (id) => {
    try {
      const response = await apiClient.delete(`/staff/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка удаления сотрудника ${id}:`, error);
      throw error;
    }
  }
};

export default staffApi;