import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import productApi from '../api/product';
import '../style/home/detail-page.css';
import Header from '../components/ux/Header'; 
import Footer from '../components/ux/Footer'; 
import DetailPageSkeleton from '../components/Skeletons/SkeletonLoader';

const Products = () => {
    const { id } = useParams();
    const [product, setproduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchproductDetails = useCallback(async () => {
        try {
            setLoading(true);
            const productData = await productApi.getOne(id);
            setproduct(productData);
            setError(null);
        } catch (err) {
            console.error('Ошибка загрузки детальной информации о программе:', err);
            setError('Не удалось загрузить информацию о программе');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchproductDetails();
    }, [fetchproductDetails]);

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

    if (!product) {
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
                            {product.media && (
                            <div className="detail-image">
                                <img src={`https://anotsenimzhizn.ru${product.media}`} alt={product.title} />
                            </div>
                            )} 
                            <h1 className="detail-title">{product.title}</h1>
                        </div>
                        
                        <div className="detail-description">
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Products;
