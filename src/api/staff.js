import axios from 'axios';

const API_BASE_URL = 'https://anotsenimzhizn.ru/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const staffAPI = {
  getAllStaff: async () => {
    try {
      const response = await api.get('/staff');
      return response.data;
    } catch (error) {
      if (error.response?.status === 500) {
        return [];
      }
      throw error;
    }
  },

  getStaffById: async (id) => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },

  createStaff: async (staffData) => {
    if (!staffData.name || staffData.name.trim() === '') {
      throw new Error('Имя сотрудника обязательно');
    }

    const formData = new FormData();
    
    if (staffData.name) formData.append('name', staffData.name.trim());
    if (staffData.position) formData.append('position', staffData.position);
    if (staffData.callsign) formData.append('callsign', staffData.callsign);
    if (staffData.about) formData.append('about', staffData.about);
    if (staffData.external_texts) formData.append('external_texts', staffData.external_texts);
    if (staffData.photo) formData.append('photo', staffData.photo);

    const response = await api.post('/staff', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  updateStaff: async (id, staffData) => {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error(`Неверный ID сотрудника: ${id}`);
    }

    if (!staffData.name || staffData.name.trim() === '') {
      throw new Error('Имя сотрудника обязательно');
    }

    const formData = new FormData();
    
    if (staffData.name) formData.append('name', staffData.name.trim());
    if (staffData.position !== undefined) formData.append('position', staffData.position);
    if (staffData.callsign !== undefined) formData.append('callsign', staffData.callsign);
    if (staffData.about !== undefined) formData.append('about', staffData.about);
    if (staffData.external_texts !== undefined) formData.append('external_texts', staffData.external_texts);
    if (staffData.photo) formData.append('photo', staffData.photo);

    const response = await api.put(`/staff/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  partialUpdateStaff: async (id, updates) => {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error(`Неверный ID сотрудника: ${id}`);
    }

    const formData = new FormData();
    const allowedFields = ['name', 'position', 'callsign', 'about', 'external_texts'];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined && updates[field] !== null) {
        formData.append(field, updates[field]);
      }
    });
    
    if (updates.photo) formData.append('photo', updates.photo);

    if (formData.entries().next().done) {
      throw new Error('Нет данных для обновления');
    }

    const response = await api.patch(`/staff/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  deleteStaff: async (id) => {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error(`Неверный ID сотрудника: ${id}`);
    }

    const response = await api.delete(`/staff/${id}`);
    return response.data;
  }
};

export default staffAPI;
