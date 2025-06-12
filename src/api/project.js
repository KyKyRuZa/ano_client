import axios from 'axios';

const API_BASE_URL = 'https://anotsenimzhizn.ru/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Добавляем интерцептор для логирования запросов
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Добавляем интерцептор для логирования ответов
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

function objectToFormData(obj) {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
      console.log('FormData entry:', key, value);
    }
  });
  return formData;
}

const projectAPI = {

  getAllProjects: async () => {
    try {
      console.log('Fetching all projects...');
      const response = await api.get('/projects');
      console.log('Projects fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении проектов:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Возвращаем пустой массив в случае ошибки, чтобы не ломать UI
      if (error.response?.status === 500) {
        console.warn('Сервер недоступен, возвращаем пустой массив');
        return [];
      }
      
      throw error;
    }
  },

  getProjectById: async (id) => {
    try {
      console.log(`Fetching project with ID: ${id}`);
      const response = await api.get(`/projects/${id}`);
      console.log('Project fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении проекта:', {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  createProject: async (projectData) => {
    try {
      console.log('Creating project with data:', projectData);
      
      const formData = objectToFormData(projectData);

      // Логируем содержимое FormData
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      const response = await api.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Project created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании проекта:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectData: {
          title: projectData.title,
          description: projectData.description,
          hasMediaPath: !!projectData.media_path,
          media_type: projectData.media_type
        }
      });
      throw error;
    }
  },

  updateProject: async (id, projectData) => {
    try {
      console.log(`Updating project ${id} with data:`, projectData);
      
      const formData = objectToFormData(projectData);

      // Логируем содержимое FormData
      console.log('FormData contents for update:');
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      const response = await api.put(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Project updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении проекта:', {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectData: {
          title: projectData.title,
          description: projectData.description,
          hasMediaPath: !!projectData.media_path,
          media_type: projectData.media_type
        }
      });
      throw error;
    }
  },

  partialUpdateProject: async (id, updates) => {
    try {
      console.log(`Partially updating project ${id} with updates:`, updates);
      
      const formData = objectToFormData(updates);

      // Логируем содержимое FormData
      console.log('FormData contents for partial update:');
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      const response = await api.patch(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Project partially updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при частичном обновлении проекта:', {
        id,
        updates,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      console.log(`Deleting project with ID: ${id}`);
      const response = await api.delete(`/projects/${id}`);
      console.log('Project deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении проекта:', {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }
};

export default projectAPI;
