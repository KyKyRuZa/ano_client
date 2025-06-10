import axios from 'axios';

const API_BASE_URL = 'https://anotsenimzhizn.ru/api/staff'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const staffApi = {
  createStaff: async (staffData) => {
    try {
      if (staffData instanceof FormData) {
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
