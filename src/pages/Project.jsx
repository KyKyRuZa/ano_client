import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style/project.css';
import Header from '../components/ux/Header';
import Footer from '../components/ux/Footer';
import projectsAPI from '../api/project';

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const projectData = await projectsAPI.getProjectById(id);
        setProject(projectData);
      } catch (error) {
        console.error('Ошибка при загрузке проекта:', error);
        setError('Не удалось загрузить проект');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Header/>
        <div className="project-container">
          <div>Загрузка...</div>
        </div>
        <Footer/>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Header/>
        <div className="project-container">
          <div>{error || 'Проект не найден'}</div>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Header/>
      <div className="project-container">
        <div>
          <div className='title'> 
            <img 
              src={project.media_path || project.image } 
              alt={project.title || project.name} 
            />
            <h1>{project.title || project.name}</h1>
          </div>
        
          <div className='discription'>
            {project.description || project.content || 'Описание отсутствует'}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Project;
