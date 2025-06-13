import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import projectApi from '../api/project';
import '../style/home/programs.css';
import Header from '../components/ux/Header'; 
import Footer from '../components/ux/Footer'; 

const Programs = () => {
    const { id } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchProgramDetails = async () => {
            try {
                setLoading(true);
                const programData = await projectApi.getOne(id);
                setProgram(programData);
                setError(null);
            } catch (err) {
                console.error('Ошибка загрузки детальной информации о программе:', err);
                setError('Не удалось загрузить информацию о программе');
            } finally {
                setLoading(false);
            }
        };
    useEffect(() => {
        fetchProgramDetails();
    }, [id]);

    

    if (loading) {
        return <div className="loading">Загрузка программы...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!program) {
        return <div className="not-found">Программа не найдена</div>;
    }

    return (
         <div>
            <Header />
            <div className="program-page">
                <div className="program-container">
                    <div className="program-content">
                        <div className='program-header'>
                            {program.media && (
                            <div className="program-image">
                                <img src={`https://anotsenimzhizn.ru/${program.media}`} alt={program.title} />
                            </div>
                            )} 
                            <h1 className="program-title">{program.title}</h1>
                        </div>
                        
                        <div className="program-description">
                            <p>{program.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Programs;