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
import { projectAPI } from '../../api/project';
import '../../style/admin.staff.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    id: null,
    title: '',
    description: '',
    media_path: null,
    media_type: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await projectAPI.getAllProjects();
        setProjects(projectsData);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки проектов');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media_path') {
      const file = files[0];
      if (file) {
        setCurrentProject((prev) => ({ 
          ...prev, 
          media_path: file,
          media_type: file.type.startsWith('image/') ? 'image' : 
                     file.type.startsWith('video/') ? 'video' : 'document'
        }));
      }
    } else {
      setCurrentProject((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setCurrentProject({
      id: null,
      title: '',
      description: '',
      media_path: null,
      media_type: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setCurrentProject({
      ...project,
      media_path: null // Сбрасываем файл для редактирования
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Проверка: id должен быть числом и больше 0 при редактировании
  if (isEditing && (!currentProject.id || isNaN(currentProject.id))) {
    console.error('Ошибка: ID проекта отсутствует или неверен');
    setError('ID проекта должен быть числом');
    return;
  }

  try {
    const projectData = {
      title: currentProject.title,
      description: currentProject.description,
      media_path: currentProject.media_path,
      media_type: currentProject.media_type
    };

    let updatedOrCreated;

    if (isEditing) {
      updatedOrCreated = await projectAPI.updateProject(currentProject.id, projectData);
      setProjects(projects.map(proj => (proj.id === updatedOrCreated.id ? updatedOrCreated : proj)));
    } else {
      updatedOrCreated = await projectAPI.createProject(projectData);
      setProjects([...projects, updatedOrCreated]);
    }

    setIsModalOpen(false);
  } catch (err) {
    console.error('Ошибка при сохранении проекта:', err);
    setError(err.message || 'Ошибка при сохранении проекта');
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      try {
        await projectAPI.deleteProject(id);
        setProjects(projects.filter(proj => proj.id !== id));
      } catch (err) {
        console.error('Ошибка удаления:', err);
        setError(err.message || 'Ошибка при удалении проекта');
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

  const renderMediaPreview = (project) => {
    if (!project.media_path) return null;
    
    if (project.media_type === 'image') {
      return (
        <img 
          src={project.media_path} 
          alt={project.title}
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
        <h1>Управление проектами</h1>
        <button className="btn btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Добавить проект
        </button>
      </div>

      {/* Таблица с проектами */}
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
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <div className="project-title">
                    {project.title}
                  </div>
                </td>
                <td>
                  <div className="project-description">
                    {project.description ? 
                      (project.description.length > 100 ? 
                        `${project.description.substring(0, 100)}...` : 
                        project.description
                      ) : '-'
                    }
                  </div>
                </td>
                <td>
                  <div className="media-cell">
                    {renderMediaPreview(project)}
                  </div>
                </td>
                <td>
                  <span className={`media-type-badge ${getMediaTypeClass(project.media_type)}`}>
                    {getMediaTypeText(project.media_type)}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-edit" 
                      onClick={() => openEditModal(project)}
                      title="Редактировать"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className="btn btn-delete" 
                      onClick={() => handleDelete(project.id)}
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
            <h2>{isEditing ? 'Редактировать проект' : 'Добавить проект'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название проекта *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={currentProject.title} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Описание</label>
                <textarea 
                  name="description" 
                  value={currentProject.description} 
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Описание проекта..."
                />
              </div>
              
              <div className="form-group">
                <label>Медиа файл</label>
                <input 
                  type="file" 
                  name="media_path" 
                  accept="image/*,video/*,.pdf,.doc,.docx" 
                  onChange={handleInputChange} 
                />
                {isEditing && (
                  <small className="form-hint">
                    Оставьте пустым, если не хотите изменять медиа файл
                  </small>
                )}
              </div>

              {currentProject.media_type && (
                <div className="form-group">
                  <label>Тип медиа</label>
                  <input 
                    type="text" 
                    value={getMediaTypeText(currentProject.media_type)}
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

export default ProjectsPage;