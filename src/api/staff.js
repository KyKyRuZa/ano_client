import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/staff';

const staffApi = {
  getAll: async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
  },
  
  getOne: async (id) => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
  },

  create: async (staffData) => {
    try {
      const response = await axios.post(BASE_URL, staffData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating staff:', error.response?.data || error);
      
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      
      throw error;
    }
  },
  update: async (id, staffData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, staffData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating staff:', error.response?.data || error);
      
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      
      throw error;
    }
  },
  delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка удаления сотрудника:', error.response?.data || error.message);
            throw error;
        }
    }
};

export default staffApi;