import axios from 'axios';

const API_BASE_URL = 'https://anotsenimzhizn.ru/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const programAPI = {
  getAllPrograms: async () => {
    try {
      const response = await api.get('/programs');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении программ:', error);
      throw error;
    }
  },

  // Получить программу по ID
  getProgramById: async (id) => {
    try {
      const response = await api.get(`/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении программы:', error);
      throw error;
    }
  },

  // Создать новую программу
  createProgram: async (programData) => {
    try {
      const formData = new FormData();
      
      // Добавляем текстовые поля
      if (programData.title) {
        formData.append('title', programData.title);
      }
      if (programData.description) {
        formData.append('description', programData.description);
      }
      
      // Добавляем файл
      if (programData.file) {
        formData.append('file', programData.file);
      }

      const response = await api.post('/programs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании программы:', error);
      throw error;
    }
  },

  updateProgram: async (id, programData) => {
    try {
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
      
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении программы:', error);
      throw error;
    }
  },

  partialUpdateProgram: async (id, updates) => {
    try {
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
      
      return response.data;
    } catch (error) {
      console.error('Ошибка при частичном обновлении программы:', error);
      throw error;
    }
  },

  deleteProgram: async (id) => {
    try {
      const response = await api.delete(`/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении программы:', error);
      throw error;
    }
  },
};

export default programAPI;