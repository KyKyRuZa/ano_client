import axios from 'axios';

const API_BASE_URL = 'https://anotsenimzhizn.ru/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

const programAPI = {
  getAllPrograms: async () => {
    try {
      console.log('Fetching all programs...');
      const response = await api.get('/programs');
      console.log('Programs fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении программ:', {
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

  // Получить программу по ID
  getProgramById: async (id) => {
    try {
      console.log(`Fetching program with ID: ${id}`);
      const response = await api.get(`/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении программы:', {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Создать новую программу
  createProgram: async (programData) => {
    try {
      console.log('Creating program with data:', programData);
      
      const formData = new FormData();
      
      // Добавляем текстовые поля
      if (programData.title) {
        formData.append('title', programData.title);
        console.log('Added title:', programData.title);
      }
      if (programData.description) {
        formData.append('description', programData.description);
        console.log('Added description:', programData.description);
      }
      
      // Добавляем файл
      if (programData.file) {
        formData.append('file', programData.file);
        console.log('Added file:', programData.file.name, programData.file.type);
      }

      // Логируем содержимое FormData
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      const response = await api.post('/programs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Program created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании программы:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        programData: {
          title: programData.title,
          description: programData.description,
          hasFile: !!programData.file
        }
      });
      throw error;
    }
  },

  updateProgram: async (id, programData) => {
    try {
      console.log(`Updating program ${id} with data:`, programData);
      
      const formData = new FormData();
      
      if (programData.title) {
        formData.append('title', programData.title);
      }
      if (programData.description) {
        formData.append('description', programData.description);
      }
      
      if (programData.file) {
        formData.append('file', programData.file);
      }

      const response = await api.put(`/programs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Program updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении программы:', {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  partialUpdateProgram: async (id, updates) => {
    try {
      console.log(`Partially updating program ${id} with updates:`, updates);
      
      const formData = new FormData();
      
      // Добавляем только те поля, которые нужно обновить
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && updates[key] !== null) {
          if (key === 'file') {
            formData.append('file', updates[key]);
          } else {
            formData.append(key, updates[key]);
          }
        }
      });

      const response = await api.patch(`/programs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Program partially updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при частичном обновлении программы:', {
        id,
        updates,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  deleteProgram: async (id) => {
    try {
      console.log(`Deleting program with ID: ${id}`);
      const response = await api.delete(`/programs/${id}`);
      console.log('Program deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении программы:', {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
};

export default programAPI;
