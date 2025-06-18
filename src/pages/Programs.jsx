import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import programApi from '../api/program';
import '../style/home/detail-page.css';
import Header from '../components/ux/Header'; 
import Footer from '../components/ux/Footer'; 
import DetailPageSkeleton from '../components/Skeletons/SkeletonLoader';

const Programs = () => {
    const { id } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProgramDetails = useCallback(async () => {
        try {
            setLoading(true);
            const programData = await programApi.getOne(id);
            setProgram(programData);
            setError(null);
        } catch (err) {
            console.error('Ошибка загрузки детальной информации о программе:', err);
            setError('Не удалось загрузить информацию о программе');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProgramDetails();
    }, [fetchProgramDetails]);

    // остальной код остается без изменений...
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

    if (!program) {
        return (
            <>
                <Header />
                <div className="not-found">Программа не найдена</div>
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
                            {program.media && (
                            <div className="detail-image">
                                <img src={`https://anotsenimzhizn.ru/${program.media}`} alt={program.title} />
                            </div>
                            )} 
                            <h1 className="detail-title">{program.title}</h1>
                        </div>
                        
                        <div className="detail-description">
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
