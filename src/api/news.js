import axios from 'axios';

const API_BASE_URL = 'http://anotsenimzhizn.ru/';

export const fetchMessages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/messages`);
    
    return response.data.map(message => {
      // Унифицируем обработку медиафайлов
      const processedMessage = {
        ...message,
        media_url: message.media_url && !message.media_url.startsWith('http') 
          ? `${API_BASE_URL}${message.media_url}` 
          : message.media_url
      };

      return processedMessage;
    });
  } catch (error) {
    console.error("Ошибка при получении сообщений:", error);
    throw error;
  }
};
