import axios from 'axios';

const API_BASE_URL = 'http://anotsenimzhizn.ru/';

export const fetchMessages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/messages`);
    
    return response.data.map(message => {
      const processedMessage = { ...message };

      if (message.media_url && !message.media_url.startsWith('http')) {
        processedMessage.media_url = `${API_BASE_URL}${message.media_url}`;
      }

      if (message.media_urls && Array.isArray(message.media_urls)) {
        processedMessage.media_urls = message.media_urls.map(url => {
          if (url && !url.startsWith('http')) {
            return `${API_BASE_URL}${url}`;
          }
          return url;
        });
      }

      return processedMessage;
    });
  } catch (error) {
    console.error("Ошибка при получении сообщений:", error);
    throw error;
  }
};
