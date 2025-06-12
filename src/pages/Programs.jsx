import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style/project.css'; // Используем те же стили что и для проектов
import programImage from '../style/assets/p-1.png'; // Можете создать отдельное изображение для программ
import Header from '../components/ux/Header';
import Footer from '../components/ux/Footer';
import programsAPI from '../api/programs';

const Programs = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const programData = await programsAPI.getProgramById(id);
        setProgram(programData);
      } catch (error) {
        console.error('Ошибка при загрузке программы:', error);
        setError('Не удалось загрузить программу');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProgram();
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

  if (error || !program) {
    return (
      <>
        <Header/>
        <div className="project-container">
          <div>{error || 'Программа не найдена'}</div>
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
              src={program.media_path || program.image || programImage} 
              alt={program.title || program.name} 
              onError={(e) => {
                e.target.src = programImage;
              }}
            />
            <h1>{program.title || program.name}</h1>
          </div>
        
          <div className='discription'>
            {program.description || program.content || 'Описание отсутствует'}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Programs;
