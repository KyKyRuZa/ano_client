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
import '../../style/admin.staff.css'

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({
    id: null,
    name: '',
    position: '',
    callsign: '',
    about: '',
    photo: null
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffData = await staffApi.getAllStaff();
        setStaff(staffData);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setCurrentStaff((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setCurrentStaff((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setCurrentStaff({
      id: null,
      name: '',
      position: '',
      callsign: '',
      about: '',
      photo: null
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setCurrentStaff(employee);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    Object.entries(currentStaff).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (isEditing) {
      try {
        const updated = await staffApi.updateStaff(currentStaff.id, formData);
        setStaff(staff.map(emp => (emp.id === updated.id ? updated : emp)));
      } catch (updateError) {
        console.error('Update error details:', updateError.response ? updateError.response.data : updateError);
        throw updateError;
      }
    } else {
      try {
        const created = await staffApi.createStaff(formData);
        setStaff([...staff, created]);
      } catch (createError) {
        console.error('Create error details:', createError.response ? createError.response.data : createError);
        throw createError;
      }
    }
    setIsModalOpen(false);
  } catch (err) {
    console.error('Detailed error:', err);
    alert(`Не удалось сохранить данные сотрудника: ${err.message}`);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) return;

    try {
      await staffApi.deleteStaff(id);
      setStaff(staff.filter(emp => emp.id !== id));
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить сотрудника');
    }
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

      {/* Таблица с данными */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Должность</th>
              <th>Позывной</th>
              <th>О сотруднике</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.callsign || '-'}</td>
                <td>{employee.about || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-edit" onClick={() => openEditModal(employee)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(employee.id)}>
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
                <label>ФИО</label>
                <input type="text" name="name" value={currentStaff.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Должность</label>
                <input type="text" name="position" value={currentStaff.position} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Позывной</label>
                <input type="text" name="callsign" value={currentStaff.callsign} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>О сотруднике</label>
                <textarea name="about" value={currentStaff.about} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Фото</label>
                <input type="file" name="photo" accept="image/*" onChange={handleInputChange} />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-save">
                  <FontAwesomeIcon icon={faSave} /> Сохранить
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => setIsModalOpen(false)}>
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