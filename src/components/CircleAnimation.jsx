import React, { useEffect, useRef, useState, useCallback } from 'react';
import "../style/home/loading.css";
import { ReactComponent as Hart } from "../style/assets/logo.svg";

const CircleAnimation = ({ onComplete, timeout = 10000 }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [error, setError] = useState(false);

  // Мемоизированная функция завершения анимации
  const completeAnimation = useCallback(() => {
    if (isAnimationComplete) return;
    
    setIsAnimationComplete(true);
    
    // Очищаем все таймеры и анимации
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Запускаем fade-out анимацию
    setTimeout(() => {
      document.body.style.overflow = 'unset';
      if (onComplete) onComplete();
    }, 500);
  }, [isAnimationComplete, onComplete]);

  // Обработка ошибок
  const handleError = useCallback((errorMessage) => {
    console.error('CircleAnimation error:', errorMessage);
    setError(true);
    completeAnimation();
  }, [completeAnimation]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
      
      // Очистка при размонтировании
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const drawTextOnArc = useCallback((canvas, text, radius, startAngle, endAngle, rotationOffset) => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');

      ctx.font = '20px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const angleStep = (endAngle - startAngle) / text.length;

      for (let i = 0; i < text.length; i++) {
        const angle = startAngle + angleStep * i + rotationOffset;
        const x = canvas.width / 2 + radius * Math.cos(angle);
        const y = canvas.height / 2 + radius * Math.sin(angle);
        const rotationAngle = angle - Math.PI / 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotationAngle);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
      }
    } catch (error) {
      handleError(`Error drawing text on arc: ${error.message}`);
    }
  }, [handleError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    try {
      const ctx = canvas.getContext('2d');

      startTimeRef.current = Date.now();
      const animationDuration = 6000;

      const textTop = 'Светя другим, сгораю сам'.split('').reverse().join('');
      const textBottom = 'Aliis intervendo consumer cam'.split('').reverse().join('');
      const radius = 150;
      const topStartAngle = Math.PI / 12;
      const topEndAngle = (11 / 12) * Math.PI;
      const bottomStartAngle = (13 / 12) * Math.PI;
      const bottomEndAngle = (23 / 12) * Math.PI;

      timeoutRef.current = setTimeout(() => {
        if (!isAnimationComplete) {
          console.warn('Animation forced to complete due to timeout');
          completeAnimation();
        }
      }, timeout);

      const animate = () => {
        try {
          if (isAnimationComplete) return;

          const currentTime = Date.now();
          const elapsed = currentTime - startTimeRef.current;

          if (elapsed >= animationDuration) {
            rotationOffset = Math.PI * 2; 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawTextOnArc(canvas, textTop, radius, topStartAngle, topEndAngle, rotationOffset);
            drawTextOnArc(canvas, textBottom, radius, bottomStartAngle, bottomEndAngle, rotationOffset);
            completeAnimation();
            return;
          }

          const progress = elapsed / animationDuration;
          rotationOffset = progress * Math.PI * 2;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          drawTextOnArc(canvas, textTop, radius, topStartAngle, topEndAngle, rotationOffset);
          drawTextOnArc(canvas, textBottom, radius, bottomStartAngle, bottomEndAngle, rotationOffset);

          if (!isAnimationComplete) {
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        } catch (error) {
          handleError(`Animation error: ${error.message}`);
        }
      };

      let rotationOffset = 0;

      setTimeout(() => {
        if (!isAnimationComplete) {
          animate();
        }
      }, 100);

    } catch (error) {
      handleError(`Canvas initialization error: ${error.message}`);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isAnimationComplete, completeAnimation, drawTextOnArc, handleError, timeout]);

  

  return (
    <div className={`animate-container ${isAnimationComplete ? 'fade-out' : ''}`}>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="canvas"
          width={500}
          height={500}
        />
        <Hart className="hart" />
      </div>
    </div>
  );
};

export default CircleAnimation;
