import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faPause, 
  faVolumeMute, 
  faVolumeUp,
  faChevronLeft,
  faChevronRight 
} from '@fortawesome/free-solid-svg-icons';
import { fetchMessages } from '../api/news';
import '../style/news.css';


function MessageList() {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleMessages, setVisibleMessages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAudio, setActiveAudio] = useState(null);
  const [playingStates, setPlayingStates] = useState({});
  const [audioVolume, setAudioVolume] = useState(1);
  const [audioProgress, setAudioProgress] = useState({});
  const [audioDurations, setAudioDurations] = useState({});
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const audioRefs = useRef({});
  const observerRef = useRef();
  
  const [mediaGroupCurrentIndex, setMediaGroupCurrentIndex] = useState({});

  const messagesPerPage = 5;

  const SkeletonLoader = () => (
  
  <div className="skeleton-container">
    <div className="skeleton-message-list">
      {[...Array(messagesPerPage)].map((_, index) => (
        <div key={index} className="skeleton-message-card">
          <div className="skeleton-content">
            {Math.random() > 0.3 ? (
              <div className="skeleton-media"></div>
            ) : Math.random() > 0.5 ? (
              <div className="skeleton-audio"></div>
            ) : (
              <div className="skeleton-document"></div>
            )}
            
            <div className="skeleton-text-container">
              <div className="skeleton-text-lines">
                <div className="skeleton-line skeleton-line-long"></div>
                <div className="skeleton-line skeleton-line-medium"></div>
                {Math.random() > 0.5 && (
                  <div className="skeleton-line skeleton-line-short"></div>
                )}
              </div>
            </div>
            
            <div className="skeleton-footer">
              <div className="skeleton-date"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoading(true);
        const data = await fetchMessages();
        setMessages(data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки сообщений:', err);
        setError('Не удалось загрузить сообщения');
        setLoading(false);
      }
    };
    getMessages();
  }, []);

  useEffect(() => {
    if (page > 1) {
      const startIndex = (page - 1) * messagesPerPage;
      const endIndex = startIndex + messagesPerPage;
      const nextMessages = messages.slice(startIndex, endIndex);
      
      setVisibleMessages(prev => [...prev, ...nextMessages]);
      setHasMore(endIndex < messages.length);
    }
  }, [page, messages]);

  const totalPages = Math.ceil(messages.length / messagesPerPage);

  const getCurrentPageMessages = () => {
    const startIndex = (currentPage - 1) * messagesPerPage;
    return messages.slice(startIndex, startIndex + messagesPerPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPagination = () => (
    <div className="pagination">
      <button 
        onClick={handlePrevPage} 
        disabled={currentPage === 1}
        className="pagination-btn"
        aria-label="Предыдущая страница"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      
      <span className="pagination-info">
        Страница {currentPage} из {totalPages}
      </span>
      
      <button 
        onClick={handleNextPage} 
        disabled={currentPage === totalPages}
        className="pagination-btn"
        aria-label="Следующая страница"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );


  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const toggleAudio = (messageId) => {
    const audioElement = audioRefs.current[messageId];
    const newPlayingState = {...playingStates};
    
    if (newPlayingState[messageId]) {
      audioElement.pause();
      newPlayingState[messageId] = false;
    } else {
      Object.keys(audioRefs.current).forEach(key => {
        if (key !== messageId.toString()) {
          audioRefs.current[key].pause();
          newPlayingState[key] = false;
        }
      });
      audioElement.play();
      newPlayingState[messageId] = true;
    }
    
    setPlayingStates(newPlayingState);
    setActiveAudio(messageId);
  };

  const renderSingleMedia = (mediaType, mediaUrl, messageId, index = 0) => {
    const uniqueId = `${messageId}_${index}`;
    
    switch(mediaType) {
      case 'photo':
        return (
          <div className="media-container" key={uniqueId}>
            <img 
              src={mediaUrl} 
              alt="Изображение" 
              className="message-image"
            />
          </div>
        );
        
      case 'video':
      case 'animation':
        return (
          <div className="media-container" key={uniqueId}>
            <video controls className="message-video">
              <source src={mediaUrl} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>
        );
        
      case 'audio':
      case 'voice':
        return (
          <div className="audio-container" key={uniqueId}>
            <div className="audio-player">
              <audio 
                ref={el => audioRefs.current[uniqueId] = el}
                src={mediaUrl}
                onEnded={() => {
                  const newPlayingState = {...playingStates};
                  newPlayingState[uniqueId] = false;
                  setPlayingStates(newPlayingState);
                  setActiveAudio(null);
                }}
                onTimeUpdate={(e) => {
                  const progress = (e.target.currentTime / e.target.duration) * 100;
                  setAudioProgress(prev => ({
                    ...prev,
                    [uniqueId]: progress
                  }));
                }}
                onLoadedMetadata={(e) => {
                  setAudioDurations(prev => ({
                    ...prev,
                    [uniqueId]: e.target.duration
                  }));
                }}
              />
              
              <button 
                className={`audio-play-btn ${playingStates[uniqueId] ? 'active' : ''}`}
                onClick={() => toggleAudio(uniqueId)}
                aria-label={playingStates[uniqueId] ? "Пауза" : "Воспроизвести"}
              >
                <FontAwesomeIcon 
                  icon={playingStates[uniqueId] ? faPause : faPlay} 
                />
              </button>
              
              <div className="audio-progress-container">
                <span className="audio-current-time">
                  {formatTime(audioRefs.current[uniqueId]?.currentTime || 0)}
                </span>
                
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress[uniqueId] || 0}
                  className="audio-progress-bar"
                  onChange={(e) => {
                    const audioElement = audioRefs.current[uniqueId];
                    if (audioElement && audioElement.duration) {
                      const time = (e.target.value / 100) * audioElement.duration;
                      audioElement.currentTime = time;
                      setAudioProgress(prev => ({
                        ...prev,
                        [uniqueId]: e.target.value
                      }));
                    }
                  }}
                />
                
                <span className="audio-total-time">
                  {formatTime(audioDurations[uniqueId] || 0)}
                </span>
              </div>
              
              <button 
                className="audio-volume-btn"
                onClick={() => {
                  const newVolume = audioVolume === 0 ? 1 : 0;
                  setAudioVolume(newVolume);
                  const audioElement = audioRefs.current[uniqueId];
                  if (audioElement) {
                    audioElement.volume = newVolume;
                  }
                }}
                aria-label={audioVolume === 0 ? "Включить звук" : "Выключить звук"}
              >
                <FontAwesomeIcon 
                  icon={audioVolume === 0 ? faVolumeMute : faVolumeUp} 
                />
              </button>
            </div>
          </div>
        );
        
      case 'document':
        return (
          <div className="document-container" key={uniqueId}>
            <a 
              href={mediaUrl}
              download
              className="document-download-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Скачать документ
            </a>
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderMediaContent = (message) => {
    if (message.is_media_group && message.media_types && message.media_urls) {
      const currentIndex = mediaGroupCurrentIndex[message.id] || 0;
      const totalItems = message.media_types.length;
      
      if (totalItems === 1) {
        return renderSingleMedia(message.media_types[0], message.media_urls[0], message.id, 0);
      }
      return (
        <div className="media-carousel">
          <div className="media-carousel-container">
            <div 
              className="media-carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                width: `${totalItems * 100}%`,
                transition: 'transform 0.5s ease-in-out'

              }}
            >
              {message.media_types.map((mediaType, index) => (
                <div key={index} className="media-carousel-slide">
                  {renderSingleMedia(mediaType, message.media_urls[index], message.id, index)}
                </div>
              ))}
            </div>
            
            {totalItems > 1 && (
              <>
                <button 
                  className="media-carousel-btn media-carousel-prev"
                  onClick={() => handleMediaGroupPrev(message.id, totalItems)}
                  aria-label="Предыдущий слайд"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                <button 
                  className="media-carousel-btn media-carousel-next"
                  onClick={() => handleMediaGroupNext(message.id, totalItems)}
                  aria-label="Следующий слайд"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </>
            )}
          </div>
          
          {totalItems > 1 && (
            <div className="media-carousel-indicators">
              {message.media_types.map((_, index) => (
                <button
                  key={index}
                  className={`media-carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setMediaGroupCurrentIndex(prev => ({
                    ...prev,
                    [message.id]: index
                  }))}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    } else if (message.media_type && message.media_url) {
      // Рендер одиночного медиа
      return renderSingleMedia(message.media_type, message.media_url, message.id);
    }
    return null;
  };


  const handleMediaGroupNext = (messageId, totalItems) => {
    setMediaGroupCurrentIndex(prev => ({
      ...prev,
      [messageId]: ((prev[messageId] || 0) + 1) % totalItems
    }));
  };

  const handleMediaGroupPrev = (messageId, totalItems) => {
    setMediaGroupCurrentIndex(prev => ({
      ...prev,
      [messageId]: ((prev[messageId] || 0) - 1 + totalItems) % totalItems
    }));
  };

  const lastMessageElementRef = useCallback(node => {
  if (loading) return;
  if (observerRef.current) observerRef.current.disconnect();
  observerRef.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  });
  if (node) observerRef.current.observe(node);
}, [loading, hasMore]);

  if (loading) return <div className="loading"><SkeletonLoader /></div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (messages.length === 0) return <div className="empty">Сообщений пока нет</div>;


  return (
    <div className="message-list-container">
      <div className="message-list">
        {getCurrentPageMessages().map((message, index) => (
          <div 
            key={message.id} 
            className="message-card"
            ref={index === getCurrentPageMessages().length - 1 ? lastMessageElementRef : null}
          >
            <div className="message-content">
              {renderMediaContent(message)}
              {message.text && <p className="message-text">{message.text}</p>}
              
              <div className="message-footer">
                <span className="message-date">
                  {new Date(message.timestamp).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {renderPagination()}
    </div>
  );
}

export default MessageList;