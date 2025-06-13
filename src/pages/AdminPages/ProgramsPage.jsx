import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import programApi from '../../api/program';
import '../../style/admin.staff.css';

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
        alert('Можно загружать только изображения');
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

  // Валидация
  if (!currentProgram.title || !currentProgram.description) {
    setError('Название и описание программы обязательны');
    return;
  }

  // Создание FormData
  const formData = new FormData();
  formData.append('title', currentProgram.title);
  formData.append('description', currentProgram.description);

  // Добавление медиафайла, если он существует
  if (currentProgram.media instanceof File) {
    formData.append('media', currentProgram.media);
  }

  try {
    // Логирование данных перед отправкой
    console.log('Отправляю данные:', Object.fromEntries(formData));

    // Отправка запроса
    if (isEditing) {
      await programApi.update(currentProgram.id, formData);
    } else {
      await programApi.create(formData);
    }

    // Обновление списка программ и закрытие модального окна
    fetchPrograms();
    setIsModalOpen(false);
  } catch (err) {
    console.error('Ошибка при сохранении:', err);
    const errorMessage =
      err.response?.data?.error || err.message || 'Не удалось сохранить данные программы';
    setError(errorMessage);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту программу?')) {
      try {
        await programApi.delete(id);
        setPrograms(programs.filter(p => p.id !== id));
      } catch (err) {
        console.error('Ошибка удаления программы:', err);
        setError(err.message || 'Ошибка при удалении программы');
      }
    }
  };

  const renderMediaPreview = (program) => {
    if (!program.media) return <span>-</span>;

    if (typeof program.media === 'string') {
      return (
        <img
          src={program.media}
          alt={program.title}
          className="program-photo-thumbnail"
        />
      );
    }

    if (program.media instanceof File) {
      return (
        <img
          src={URL.createObjectURL(program.media)}
          alt={program.title}
          className="program-photo-thumbnail"
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
        <h1>Программы организации</h1>
        <button className="btn btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Добавить программу
        </button>
      </div>

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
                <td>
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
                      onClick={() => handleDelete(program.id)}
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
                {isEditing && currentProgram.media && (
                  <small>Новое изображение заменит текущее</small>
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

export default ProgramsPage;