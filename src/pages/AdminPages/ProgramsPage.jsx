import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import programAPI from '../../api/programm';
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
    file: null,
    media_type: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const programsData = await programAPI.getAllPrograms();
        console.log('Loaded programs:', programsData);
        setPrograms(Array.isArray(programsData) ? programsData : []);
      } catch (err) {
        console.error('Error in fetchPrograms:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Ошибка загрузки программ';
        setError(errorMessage);
        setPrograms([]); // Устанавливаем пустой массив при ошибке
      } finally {
        setLoading(false);
      }
};


    fetchPrograms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      if (file) {
        setCurrentProgram((prev) => ({ 
          ...prev, 
          file: file,
          media_type: file.type.startsWith('image/') ? 'image' : 
                     file.type.startsWith('video/') ? 'video' : 'document'
        }));
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
      file: null,
      media_type: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (program) => {
    setCurrentProgram({
      ...program,
      file: null // Сбрасываем файл для редактирования
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing && (!currentProgram.id || isNaN(currentProgram.id))) {
      console.error('Ошибка: ID программы отсутствует или неверен');
      setError('ID программы должен быть числом');
      return;
    }

    try {
      const programData = {
        title: currentProgram.title,
        description: currentProgram.description,
        file: currentProgram.file,
        media_type: currentProgram.media_type
      };

      console.log('Отправляемые данные:', programData); // Добавить отладку

      let updatedOrCreated;

      if (isEditing) {
        updatedOrCreated = await programAPI.updateProgram(currentProgram.id, programData);
        setPrograms(programs.map(prog => (prog.id === updatedOrCreated.id ? updatedOrCreated : prog)));
      } else {
        updatedOrCreated = await programAPI.createProgram(programData);
        setPrograms([...programs, updatedOrCreated]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Ошибка при сохранении программы:', err);
      console.error('Детали ошибки:', err.response?.data); // Добавить детали
      setError(err.response?.data?.error || err.message || 'Ошибка при сохранении программы');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту программу?')) {
      try {
        await programAPI.deleteProgram(id);
        setPrograms(programs.filter(prog => prog.id !== id));
      } catch (err) {
        console.error('Ошибка удаления:', err);
        setError(err.message || 'Ошибка при удалении программы');
      }
    }
  };

  const getMediaTypeText = (mediaType) => {
    const typeMap = {
      'image': 'Изображение',
      'video': 'Видео',
      'document': 'Документ'
    };
    return typeMap[mediaType] || mediaType || '-';
  };

  const getMediaTypeClass = (mediaType) => {
    const typeClasses = {
      'image': 'media-image',
      'video': 'media-video',
      'document': 'media-document'
    };
    return typeClasses[mediaType] || '';
  };

  const renderMediaPreview = (program) => {
    if (!program.file) return null;
    
    if (program.media_type === 'image') {
      return (
        <img 
          src={program.file} 
          alt={program.title}
          className="media-preview-small"
          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
        />
      );
    }
    
    return (
      <span className="media-indicator">
        <FontAwesomeIcon icon={faEye} />
      </span>
    );
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Управление программами</h1>
        <button className="btn btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Добавить программу
        </button>
      </div>

      {/* Таблица с программами */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Медиа</th>
              <th>Тип медиа</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                <td>
                  <div className="project-title">
                    {program.title}
                  </div>
                </td>
                <td>
                  <div className="project-description">
                    {program.description ? 
                      (program.description.length > 100 ? 
                        `${program.description.substring(0, 100)}...` : 
                        program.description
                      ) : '-'
                    }
                  </div>
                </td>
                <td>
                  <div className="media-cell">
                    {renderMediaPreview(program)}
                  </div>
                </td>
                <td>
                  <span className={`media-type-badge ${getMediaTypeClass(program.media_type)}`}>
                    {getMediaTypeText(program.media_type)}
                  </span>
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
                <label>Название программы *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={currentProgram.title} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Описание</label>
                <textarea 
                  name="description" 
                  value={currentProgram.description} 
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Описание программы..."
                />
              </div>
              
              <div className="form-group">
                <label>Файл программы</label>
                <input 
                  type="file" 
                  name="file" 
                  accept="image/*,video/*,.pdf,.doc,.docx" 
                  onChange={handleInputChange} 
                />
                {isEditing && (
                  <small className="form-hint">
                    Оставьте пустым, если не хотите изменять файл
                  </small>
                )}
              </div>

              {currentProgram.media_type && (
                <div className="form-group">
                  <label>Тип медиа</label>
                  <input 
                    type="text" 
                    value={getMediaTypeText(currentProgram.media_type)}
                    disabled
                    className="form-control-disabled"
                  />
                </div>
              )}
              
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