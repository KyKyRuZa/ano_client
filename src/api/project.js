import axios from 'axios';

const API_BASE_URL = 'https://anotsenimzhizn.ru/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});


function objectToFormData(obj) {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
}

const projectAPI = {

  getAllProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении проектов:', error.message);
      throw error;
    }
  },


  getProjectById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении проекта:', error.message);
      throw error;
    }
  },

  createProject: async (projectData) => {
    try {
      const formData = objectToFormData(projectData);

      const response = await api.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка при создании проекта:', error.message);
      throw error;
    }
  },

  updateProject: async (id, projectData) => {
    try {
      const formData = objectToFormData(projectData);

      const response = await api.put(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении проекта:', error.message);
      throw error;
    }
  },

  partialUpdateProject: async (id, updates) => {
    try {
      const formData = objectToFormData(updates);

      const response = await api.patch(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка при частичном обновлении проекта:', error.message);
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении проекта:', error.message);
      throw error;
    }
  }
};

export default projectAPI;