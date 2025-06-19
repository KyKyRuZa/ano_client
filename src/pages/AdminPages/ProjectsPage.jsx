import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import projectApi from '../../api/project';
import '../../style/admin/admin.staff.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    id: null,
    title: '',
    description: '',
    media: null
  });
  const [isEditing, setIsEditing] = useState(false);

  // Состояния для подтверждения удаления
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData = await projectApi.getAll();
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      console.error('Ошибка загрузки проектов:', err);
      const errorMessage =
        err.response?.data?.error || err.message || 'Ошибка загрузки проектов';
      setError(errorMessage);
      setProjects([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media') {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        setCurrentProject((prev) => ({
          ...prev,
          media: file
        }));
      } else if (file) {
        alert('Можно загружать только изображения');
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
      media: null
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setCurrentProject({
      ...project,
      media: null
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentProject.title || !currentProject.description) {
      setError('Название и описание проекта обязательны');
      return;
    }

    const formData = new FormData();
    formData.append('title', currentProject.title);
    formData.append('description', currentProject.description);

    if (currentProject.media instanceof File) {
      formData.append('media', currentProject.media);
    }

    try {
      if (isEditing) {
        await projectApi.update(currentProject.id, formData);
      } else {
        await projectApi.create(formData);
      }

      fetchProjects();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      const errorMessage = 'Не удалось сохранить данные программы';
      setError(errorMessage);
    }
  };

  const handleDeleteClick = (id) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setProjectToDelete(project);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = async () => {
    const id = projectToDelete.id;
    try {
      await projectApi.delete(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Ошибка удаления проекта:', err);
      setError(err.message || 'Ошибка при удалении проекта');
    } finally {
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Проекты организации</h1>
        <button className="btn btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Добавить проект
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
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>
                  {project.description
                    ? project.description.length > 50
                      ? `${project.description.substring(0, 50)}...`
                      : project.description
                    : '-'}
                </td>
                <td className='act'>
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
                      onClick={() => handleDeleteClick(project.id)}
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
            <h2>{isEditing ? 'Редактировать проект' : 'Добавить проект'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название *</label>
                <input
                  type="text"
                  name="title"
                  value={currentProject.title}
                  onChange={handleInputChange}
                  placeholder='Название проекта'
                  required
                />
              </div>

              <div className="form-group">
                <label>Описание *</label>
                <textarea
                  name="description"
                  value={currentProject.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder='Описание проекта'
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
                <button type="submit" className="btn btn-save">Сохранить
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => setIsModalOpen(false)}> Отмена
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
              Вы уверены, что хотите удалить проект <strong>{projectToDelete?.title}</strong>?
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

export default ProjectsPage;