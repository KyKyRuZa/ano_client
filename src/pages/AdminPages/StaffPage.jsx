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
import '../../style/admin/adminmedia.css';

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
  const [modalError, setModalError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

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
      const errorMessage =
        err.response?.data?.error || err.message || 'Ошибка загрузки сотрудников';
      setError(errorMessage);
      setStaff([]);
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
        if (modalError) setModalError('');
      } else if (file) {
        setModalError('Можно загружать только изображения');
      }
    } else {
      setCurrentStaff((prev) => ({ ...prev, [name]: value }));
      if (modalError) setModalError('');
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
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setCurrentStaff({
      ...employee,
      media: null
    });
    setIsEditing(true);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!currentStaff.fullname || !currentStaff.position) {
      setModalError('ФИО и должность обязательны');
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
      setModalError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Не удалось сохранить данные сотрудника';
      setModalError(errorMessage);
    }
  };

  const handleDelete = (id) => {
    const employee = staff.find(emp => emp.id === id);
    if (!employee) return;

    setEmployeeToDelete(employee);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const id = employeeToDelete.id;
    try {
      await staffApi.delete(id);
      setStaff(staff.filter(emp => emp.id !== id));
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        'Ошибка при удалении сотрудника';
      setError(errorMessage);
    } finally {
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalError('');
  };

  const renderMediaPreview = (employee) => {
    if (!employee.media) return <span>-</span>;

    if (typeof employee.media === 'string') {
      return (
        <img
          src={`https://anotsenimzhizn.ru${employee.media}`} 
          alt={employee.fullname}
          className="staff-photo"
        />
      );
    }
    return <span>-</span>;
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Команда организации</h1>
        <button className="btn btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Добавить сотрудника
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

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
                <td className='act'>
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

      {/* Модальное окно для добавления/редактирования */}
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
                  placeholder='Иванов Иван Иванович'
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
                  placeholder='Начальник отдела'
                  required
                />
              </div>

              <div className="form-group">
                <label>Позывной *</label>
                <input
                  type="text"
                  name="callsign"
                  value={currentStaff.callsign || ''}
                  onChange={handleInputChange}
                  placeholder='Начальник отдела'
                  required
                />
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  name="description"
                  value={currentStaff.description || ''}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder='Описание сотрудника'
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
                <small> Разрешённые форматы: JPG, PNG. Максимальный размер: 10 МБ</small>
              </div>

              {modalError && (
                <div className="modal-error">
                  {modalError}
                </div>
              )}

              <div className="modal-actions">
                <button type="submit" className="btn btn-save">
                Сохранить
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={closeModal}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirm-delete-modal">
            <h2>Подтверждение удаления</h2>
            <p>
              Вы уверены, что хотите удалить сотрудника <strong>{employeeToDelete?.fullname}</strong>?
            </p>
              {modalError && (
                <div className="modal-error">
                  {modalError}
                </div>
              )}
            <div className="modal-actions">
              <button
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Удалить
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;