import axios from 'axios';

// Определяем базовый URL в зависимости от окружения
const API_BASE_URL = 'https://anotsenimzhizn.ru/api/staff'

// Создаем экземпляр axios с настройками для HTTPS
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для обработки ошибок
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
      console.log('=== CLIENT: Sending staff data ===');
      console.log('API URL:', API_BASE_URL);
      console.log('Type of staffData:', typeof staffData);
      console.log('Is FormData:', staffData instanceof FormData);
      
      if (staffData instanceof FormData) {
        console.log('FormData entries:');
        for (let [key, value] of staffData.entries()) {
          console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }
      } else {
        console.log('Raw data:', staffData);
      }
      
      const response = await apiClient.post('/', staffData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ Success response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create staff request failed');
      
      if (error.response?.data) {
        const serverError = error.response.data.error || error.response.data.message || `Server error: ${error.response.status}`;
        throw new Error(serverError);
      } else if (error.request) {
        throw new Error('Нет ответа от сервера');
      } else {
        throw new Error(`Ошибка запроса: ${error.message}`);
      }
    }
  },

  getAllStaff: async () => {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  getStaffById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff member ${id}:`, error);
      throw error;
    }
  },

  updateStaff: async (id, staffData) => {
    try {
      console.log('=== CLIENT: Updating staff data ===');
      console.log('Staff ID:', id);
      console.log('Type of staffData:', typeof staffData);
      
      if (staffData instanceof FormData) {
        console.log('FormData entries for update:');
        for (let [key, value] of staffData.entries()) {
          console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }
      }
      
      const response = await apiClient.put(`/${id}`, staffData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Update error');
      }
      throw error;
    }
  },

  partialUpdateStaff: async (id, staffData) => {
    try {
      let formData;
      
      if (staffData instanceof FormData) {
        formData = staffData;
      } else {
        formData = new FormData();
        Object.keys(staffData).forEach(key => {
          if (staffData[key] !== null && staffData[key] !== undefined) {
            formData.append(key, staffData[key]);
          }
        });
      }

      console.log('=== CLIENT: Partial update data ===');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }
      
      const response = await apiClient.patch(`/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Partial update error');
      }
      throw error;
    }
  },

  deleteStaff: async (id) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting staff member ${id}:`, error);
      throw error;
    }
  }
};

export default staffApi;
