import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projectAPI from '../api/project.js';
import '../style/project.css';
import Header from '../components/ux/Header.jsx';
import Footer from '../components/ux/Footer.jsx';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError('ID проекта не указан');
          return;
        }

        const projectData = await projectAPI.getProjectById(id);
        setProject(projectData);
      } catch (err) {
        console.error('Ошибка при загрузке проекта:', err);
        
        if (err.response?.status === 404) {
          setError('Проект не найден');
        } else if (err.response?.status === 500) {
          setError('Ошибка сервера. Попробуйте позже.');
        } else {
          setError('Произошла ошибка при загрузке проекта');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getMediaUrl = (mediaPath) => {
    if (!mediaPath) return null;
    
    if (mediaPath.startsWith('https://') || mediaPath.startsWith('http://')) {
      return mediaPath;
    }
    
    const path = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
    return `https://anotsenimzhizn.ru${path}`;
  };

  const renderMedia = () => {
    if (!project?.media_path) return null;

    const mediaUrl = getMediaUrl(project.media_path);
    const mediaType = project.media_type?.toLowerCase();

    if (mediaType === 'image' || mediaType === 'photo') {
      return (
        <img 
          src={mediaUrl} 
          alt={project.title}
          onError={(e) => {
            console.error('Ошибка загрузки изображения:', mediaUrl);
            e.target.style.display = 'none';
          }}
        />
      );
    } else if (mediaType === 'video') {
      return (
        <video controls>
          <source src={mediaUrl} type="video/mp4" />
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      );
    }

    return null;
  };

  if (error) {
    return (
      <div className="project-container">
        <div className="error">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>
            Назад
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-container">
        <div className="not-found">
          <p>Проект не найден</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header/>
      <div className="project-container">
        <div className="title">
          {renderMedia()}
          <h1>{project.title}</h1>
        </div>
        
        {project.description && (
          <div className="discription">
            {project.description.split('\n').map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default Project;
