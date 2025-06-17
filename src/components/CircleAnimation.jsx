import React, { useEffect, useRef, useState } from 'react';
import "../style/home/loading.css";
import { ReactComponent as Hart } from "../style/assets/logo.svg";

const CircleAnimation = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const drawTextOnArc = (canvas, text, radius, startAngle, endAngle, rotationOffset) => {
    const ctx = canvas.getContext('2d');

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
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      let rotationOffset = 0;
      let animationFrameId;
      let startTime = Date.now();
      const animationDuration = 3000; // 3 секунды анимации

      const textTop = 'Светя другим, сгораю сам'.split('').reverse().join('');
      const textBottom = 'Aliis intervendo consumer cam';

      const radius = 150;

      const topStartAngle = Math.PI / 12;
      const topEndAngle = (11 / 12) * Math.PI;

      const bottomStartAngle = (13 / 12) * Math.PI;
      const bottomEndAngle = (23 / 12) * Math.PI;

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        // Проверяем, прошло ли достаточно времени
        if (elapsed >= animationDuration && !isAnimationComplete) {
          setIsAnimationComplete(true);
          
          // Запускаем fade-out анимацию
          setTimeout(() => {
            document.body.style.overflow = 'unset';
            if (onComplete) onComplete();
          }, 500); // 500ms для fade-out анимации
          
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawTextOnArc(canvas, textTop, radius, topStartAngle, topEndAngle, rotationOffset);
        drawTextOnArc(canvas, textBottom, radius, bottomStartAngle, bottomEndAngle, rotationOffset);

        rotationOffset += 0.02618;

        if (rotationOffset > Math.PI * 2) {
          rotationOffset -= Math.PI * 2;
        }

        if (!isAnimationComplete) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animate();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [isAnimationComplete, onComplete]);

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