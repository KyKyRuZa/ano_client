import axios from 'axios';

const API_BASE_URL = 'https://anotsenimzhizn.ru/api/';

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API методы для работы с программами
export const programAPI = {
  // Получить все программы
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

  // Обновить программу (полное обновление)
  updateProgram: async (id, programData) => {
    try {
      const formData = new FormData();
      
      // Добавляем текстовые поля
      if (programData.title) {
        formData.append('title', programData.title);
      }
      if (programData.description) {
        formData.append('description', programData.description);
      }
      
      // Добавляем файл, если он есть
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

  // Частичное обновление программы
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

  // Удалить программу
  deleteProgram: async (id) => {
    try {
      const response = await api.delete(`/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении программы:', error);
      throw error;
    }
  },

  // Скачать файл программы
  downloadProgramFile: async (id) => {
    try {
      const response = await api.get(`/programs/${id}/download`, {
        responseType: 'blob',
      });
      
      // Создаем URL для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Получаем имя файла из заголовков ответа
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'program_file';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Файл успешно скачан' };
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      throw error;
    }
  },

  // Получить URL для просмотра файла
  getProgramFileUrl: (filePath) => {
    return `${API_BASE_URL}/uploads/${filePath}`;
  },

  // Поиск программ
  searchPrograms: async (query) => {
    try {
      const response = await api.get(`/programs/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при поиске программ:', error);
      throw error;
    }
  },

  // Получить программы с пагинацией
  getProgramsWithPagination: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/programs', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении программ с пагинацией:', error);
      throw error;
    }
  }
};

export default programAPI;
