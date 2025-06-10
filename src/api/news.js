import axios from 'axios';

const API_BASE_URL = 'https://anotsenimzhizn.ru';

export const fetchMessages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/apibot/messages`);
    
    return response.data.map(message => {
      const processedMessage = { ...message };

      // Обрабатываем одиночные медиа файлы
      if (message.media_url) {
        if (message.media_url.startsWith('https')) {
          processedMessage.media_url = message.media_url;
        } else {
          // Добавляем слэш если его нет в начале пути
          const path = message.media_url.startsWith('/') ? message.media_url : `/${message.media_url}`;
          processedMessage.media_url = `${API_BASE_URL}${path}`;
        }
      }

      // Обрабатываем группы медиа файлов
      if (message.media_urls && Array.isArray(message.media_urls)) {
        processedMessage.media_urls = message.media_urls.map(url => {
          if (!url) return url;
          
          if (url.startsWith('https')) {
            return url;
          } else {
            // Добавляем слэш если его нет в начале пути
            const path = url.startsWith('/') ? url : `/${url}`;
            return `${API_BASE_URL}${path}`;
          }
        });
      }

      return processedMessage;
    });
  } catch (error) {
    console.error("Ошибка при получении сообщений:", error);
    throw error;
  }
};
