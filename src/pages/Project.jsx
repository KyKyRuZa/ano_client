import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import projectApi from '../api/project';
import '../style/home/detail-page.css';
import Header from '../components/ux/Header'; 
import Footer from '../components/ux/Footer'; 
import DetailPageSkeleton from '../components/Skeletons/SkeletonLoader';

const Project = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchProjectDetails = useCallback(async () => {
        try {
            setLoading(true);
            const projectData = await projectApi.getOne(id);
            setProject(projectData);
            setError(null);
        } catch (err) {
            console.error('Ошибка загрузки детальной информации о проекте:', err);
            setError('Не удалось загрузить информацию о проекте');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

    if (loading) {
        return (
            <>
                <Header />
                <DetailPageSkeleton/>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="error">{error}</div>
                <Footer />
            </>
        );
    }

    if (!project) {
        return (
            <>
                <Header />
                <div className="not-found">Проект не найден</div>
                <Footer />
            </>
        );
    }

    return (
         <div>
            <Header />
            <div className="detail-page">
                <div className="detail-container">
                    <div className="detail-content">
                        <div className='detail-header'>
                            {project.media && (
                            <div className="detail-image">
                                <img src={`https://anotsenimzhizn.ru${project.media}`} alt={project.title} />
                            </div>
                            )} 
                            <h1 className="detail-title">{project.title}</h1>
                        </div>
                        
                        <div className="detail-description">
                            <p>{project.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Project;
