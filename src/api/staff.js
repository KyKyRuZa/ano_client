import axios from 'axios';

const API_URL = 'http://anotsenimzhizn.ru/api/staff'; 

export const staffApi = {
  createStaff: async (staffData) => {
    try {
      console.log('Sending staff data:', staffData);
      console.log('FormData entries:');
      for (let [key, value] of staffData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await axios.post(`${API_URL}/`, staffData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      // Детальное логирование ошибки
      console.error('Detailed create error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      // Если есть ответ от сервера, выбрасываем его
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Server error');
      }
      
      throw error;
    }
  },

  getAllStaff: async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  // Get staff member by ID
  getStaffById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff member ${id}:`, error);
      throw error;
    }
  },

  // Update staff member (full update)
  updateStaff: async (id, staffData) => {
    try {
      console.log('Updating staff data:', staffData);
      console.log('FormData entries for update:');
      for (let [key, value] of staffData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await axios.put(`${API_URL}/${id}`, staffData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Detailed update error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Update error');
      }
      
      throw error;
    }
  },

  // Partial update of staff member
  partialUpdateStaff: async (id, staffData) => {
    const formData = new FormData();
    
    // Append all staff fields to FormData
    Object.keys(staffData).forEach(key => {
      if (staffData[key] !== null && staffData[key] !== undefined) {
        formData.append(key, staffData[key]);
      }
    });

    try {
      console.log('Partial update data:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await axios.patch(`${API_URL}/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error partially updating staff member ${id}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Partial update error');
      }
      
      throw error;
    }
  },

  // Delete staff member
  deleteStaff: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting staff member ${id}:`, error);
      throw error;
    }
  }
};

export default staffApi;
