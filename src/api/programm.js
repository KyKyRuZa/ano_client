import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/programs';

const programApi = {
    getAll: async () => {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching programs:', error);
            throw error;
        }
    },

    getOne: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Detailed Program Fetch Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    create: async (programData) => {
        try {
            const response = await axios.post(BASE_URL, programData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating program:', error.response ? error.response.data : error);
            throw error;
        }
    },

    update: async (id, programData) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, programData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating program ${id}:`, error.response ? error.response.data : error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting program ${id}:`, error);
            throw error;
        }
    }
};

export default programApi;