import React from 'react';
import '../../style/home/skeleton.css';

// Базовый скелетон
export const Skeleton = ({ className = '', width, height, ...props }) => {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;
  
  return <div className={`skeleton ${className}`} style={style} {...props} />;
};

// Скелетон для детальной страницы
export const DetailPageSkeleton = () => {
  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="detail-content">
          <div className='detail-header'>
            <div className="detail-image">
              <Skeleton className="skeleton-detail-image" />
            </div>
            <Skeleton className="skeleton-detail-title" />
          </div>
          
          <div className="detail-description">
            <Skeleton className="skeleton-text skeleton-w-full skeleton-mb-3" />
            <Skeleton className="skeleton-text skeleton-w-3-4 skeleton-mb-3" />
            <Skeleton className="skeleton-text skeleton-w-full skeleton-mb-3" />
            <Skeleton className="skeleton-text skeleton-w-1-2 skeleton-mb-3" />
            <Skeleton className="skeleton-text skeleton-w-3-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Скелетон для новостной карточки
export const NewsCardSkeleton = () => {
  return (
    <div className="skeleton-news-card">
      <div className="skeleton-news-content">
        <Skeleton className="skeleton-news-media" />
        <div className="skeleton-news-text-container">
          <div className="skeleton-news-text-lines">
            <Skeleton className="skeleton-text skeleton-w-full" />
            <Skeleton className="skeleton-text skeleton-w-3-4" />
            <Skeleton className="skeleton-text skeleton-w-full" />
            <Skeleton className="skeleton-text skeleton-w-1-2" />
          </div>
        </div>
        <div className="skeleton-news-footer">
          <Skeleton className="skeleton-news-date" />
        </div>
      </div>
    </div>
  );
};

// Скелетон для списка новостей
export const NewsListSkeleton = ({ count = 6 }) => {
  return (
    <div className="skeleton-news-list-container">
      <div className="skeleton-news-list">
        {Array.from({ length: count }, (_, index) => (
          <NewsCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};


// Скелетон для карточки сотрудника
export const StaffCardSkeleton = () => {
  return (
    <div className="skeleton-staff-card">
      <div className="skeleton-staff-card-avatar">
        <Skeleton className="skeleton-staff-avatar skeleton-circle" />
      </div>
      <div className="skeleton-staff-card-content">
        <Skeleton className="skeleton-staff-name skeleton-w-3-4 skeleton-mb-3" />
        <Skeleton className="skeleton-staff-position skeleton-w-1-2 skeleton-mb-3" />
        <Skeleton className="skeleton-staff-department skeleton-w-3-4 skeleton-mb-4" />
        <div className="skeleton-staff-description">
          <Skeleton className="skeleton-text skeleton-w-full skeleton-mb-2" />
          <Skeleton className="skeleton-text skeleton-w-3-4 skeleton-mb-2" />
          <Skeleton className="skeleton-text skeleton-w-1-2" />
        </div>
      </div>
    </div>
  );
};

// Скелетон для страницы Staff
export const StaffPageSkeleton = ({ count = 4 }) => {
  return (
    <div className="skeleton-staff-page">
      <Skeleton className="skeleton-staff-title skeleton-title-lg skeleton-mb-6" />
      <div className="skeleton-staff-grid">
        {Array.from({ length: count }, (_, index) => (
          <StaffCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default DetailPageSkeleton;