import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import programApi from '../../api/program';
import '../../style/admin/admin.staff.css';

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState({
    id: null,
    title: '',
    description: '',
    media: null
  });
  const [isEditing, setIsEditing] = useState(false);

  // Состояния для подтверждения удаления
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const programsData = await programApi.getAll();
      setPrograms(Array.isArray(programsData) ? programsData : []);
    } catch (err) {
      console.error('Ошибка загрузки программ:', err);
      const errorMessage =
        err.response?.data?.error || err.message || 'Ошибка загрузки программ';
      setError(errorMessage);
      setPrograms([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media') {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        setCurrentProgram((prev) => ({
          ...prev,
          media: file
        }));
      } else if (file) {
        setError('Можно загружать только изображения');
      }
    } else {
      setCurrentProgram((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setCurrentProgram({
      id: null,
      title: '',
      description: '',
      media: null
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (program) => {
    setCurrentProgram({
      ...program,
      media: null
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Валидация: обязательные поля
  if (!currentProgram.title || !currentProgram.description) {
    setError('Название и описание программы обязательны');
    return;
  }

  // Валидация: если есть файл, проверяем его тип
  if (currentProgram.media && !(currentProgram.media instanceof File)) {
    setError('Некорректный формат медиафайла');
    return;
  }

  if (currentProgram.media instanceof File && !currentProgram.media.type.startsWith('image/')) {
    setError('Можно загружать только изображения');
    return;
  }

  const formData = new FormData();
  formData.append('title', currentProgram.title);
  formData.append('description', currentProgram.description);

  if (currentProgram.media instanceof File) {
    formData.append('media', currentProgram.media);
  }

  try {
    if (isEditing) {
      await programApi.update(currentProgram.id, formData);
    } else {
      await programApi.create(formData);
    }

    fetchPrograms();
    setIsModalOpen(false);
    setError(null); // Очистка ошибок
  } catch (err) {
    console.error('Ошибка при сохранении:', err);
    const errorMessage =
      err.response?.data?.error ||
      'Произошла ошибка при сохранении данных программы';
    setError(errorMessage);
  }
};

  const handleDeleteClick = (id) => {
    const program = programs.find(p => p.id === id);
    if (program) {
      setProgramToDelete(program);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = async () => {
    const id = programToDelete.id;
    try {
      await programApi.delete(id);
      setPrograms(programs.filter(p => p.id !== id));
    } catch (err) {
      console.error('Ошибка удаления программы:', err);
      setError(err.message || 'Ошибка при удалении программы');
    } finally {
      setShowDeleteConfirm(false);
      setProgramToDelete(null);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Программы организации</h1>
        <button className="btn btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Добавить программу
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                <td>{program.title}</td>
                <td>
                  {program.description
                    ? program.description.length > 50
                      ? `${program.description.substring(0, 50)}...`
                      : program.description
                    : '-'}
                </td>
                <td className='act'>
                  <div className="action-buttons">
                    <button
                      className="btn btn-edit"
                      onClick={() => openEditModal(program)}
                      title="Редактировать"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteClick(program.id)}
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
            <h2>{isEditing ? 'Редактировать программу' : 'Добавить программу'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название *</label>
                <input
                  type="text"
                  name="title"
                  value={currentProgram.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Описание *</label>
                <textarea
                  name="description"
                  value={currentProgram.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Изображение</label>
                <input
                  type="file"
                  name="media"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                 <small> Разрешённые форматы: JPG, PNG. Максимальный размер: 10 МБ</small>
              </div>
                  {error && (
                    <div className="modal-error">
                      {error}
                    </div>
                  )}
              <div className="modal-actions">
                <button type="submit" className="btn btn-save"> Сохранить
                </button>
                <button type="button" className="btn btn-cancel"onClick={() => setIsModalOpen(false)} >
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
            <h2>Подтвердите удаление</h2>
            <p>
              Вы уверены, что хотите удалить программу <strong>{programToDelete?.title}</strong>?
            </p>
              {error && (
                    <div className="modal-error">
                      {error}
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

export default ProgramsPage;