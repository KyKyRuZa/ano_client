import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/projects';

const projectApi = {
    getAll: async () => {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    },

    getOne: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching project ${id}:`, error);
            throw error;
        }
    },

    create: async (projectData) => {
        try {
            const response = await axios.post(BASE_URL, projectData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating project:', error.response ? error.response.data : error);
            throw error;
        }
    },

    update: async (id, projectData) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, projectData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating project ${id}:`, error.response ? error.response.data : error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting project ${id}:`, error);
            throw error;
        }
    }
};

export default projectApi;
