import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import staffApi from '../../api/staff';
import '../../style/admin/admin.staff.css';
import '../../style/admin/adminmedia.css'


const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({
    id: null,
    fullname: '',
    position: '',
    callsign: '',
    description: '',
    media: null
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const staffData = await staffApi.getAll();
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch (err) {
      console.error('Ошибка загрузки сотрудников:', err);
      const errorMessage =
        err.response?.data?.error || err.message || 'Ошибка загрузки сотрудников';
      setError(errorMessage);
      setStaff([]); // Устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media') {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        setCurrentStaff((prev) => ({
          ...prev,
          media: file
        }));
      } else if (file) {
        alert('Можно загружать только изображения');
      }
    } else {
      setCurrentStaff((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setCurrentStaff({
      id: null,
      fullname: '',
      position: '',
      callsign: '',
      description: '',
      media: null
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setCurrentStaff({
      ...employee,
      media: null // Сбрасываем медиафайл для редактирования
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentStaff.fullname || !currentStaff.position) {
      setError('ФИО и должность обязательны');
      return;
    }

    const formData = new FormData();
    formData.append('fullname', currentStaff.fullname);
    formData.append('position', currentStaff.position);

    if (currentStaff.callsign) formData.append('callsign', currentStaff.callsign);
    if (currentStaff.description) formData.append('description', currentStaff.description);
    if (currentStaff.media instanceof File) formData.append('media', currentStaff.media);

    try {
      if (isEditing) {
        await staffApi.update(currentStaff.id, formData);
      } else {
        await staffApi.create(formData);
      }

      fetchStaff();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Не удалось сохранить данные сотрудника';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
        try {
            await staffApi.delete(id);
            setStaff(staff.filter(s => s.id !== id));
        } catch (err) {
            console.error('Ошибка удаления сотрудника:', err);
            const errorMessage = err.response?.data?.error || 
                                 err.message || 
                                 'Ошибка при удалении сотрудника';
            setError(errorMessage);
            
            // Optional: Show a user-friendly error notification
            alert(errorMessage);
        }
    }
};

  const renderMediaPreview = (employee) => {
    if (!employee.media) return <span>-</span>;

    if (typeof employee.media === 'string') {
      return (
        <img
          src={`https://anotsenimzhizn.ru/${employee.media}`}
          alt={employee.fullname}
          className="staff-photo"
        />
      );
    }
    return <span>-</span>;
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Команда организации</h1>
        <button className="btn btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Добавить сотрудника
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Фото</th>
              <th>ФИО</th>
              <th>Должность</th>
              <th>Позывной</th>
              <th>Описание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((employee) => (
              <tr key={employee.id}>
                <td>{renderMediaPreview(employee)}</td>
                <td>{employee.fullname}</td>
                <td>{employee.position}</td>
                <td>{employee.callsign || '-'}</td>
                <td>
                  {employee.description
                    ? employee.description.length > 50
                      ? `${employee.description.substring(0, 50)}...`
                      : employee.description
                    : '-'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-edit"
                      onClick={() => openEditModal(employee)}
                      title="Редактировать"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(employee.id)}
                      title="Удалить"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ФИО *</label>
                <input
                  type="text"
                  name="fullname"
                  value={currentStaff.fullname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Должность *</label>
                <input
                  type="text"
                  name="position"
                  value={currentStaff.position}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Позывной</label>
                <input
                  type="text"
                  name="callsign"
                  value={currentStaff.callsign || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  name="description"
                  value={currentStaff.description || ''}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Фото</label>
                <input
                  type="file"
                  name="media"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                {isEditing && currentStaff.media && (
                  <small>Новое фото заменит текущее</small>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-save">
                  <FontAwesomeIcon icon={faSave} /> Сохранить
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  <FontAwesomeIcon icon={faTimes} /> Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;