// CircleAnimation.jsx
import React, { useEffect, useRef } from 'react';
import "../style/loading.css";
import { ReactComponent as Hart } from "../style/assets/logo.svg";

const CircleAnimation = ({ isAnimationComplete }) => {
  const canvasRef = useRef(null);

  // Функция для рисования текста по дуге
  const drawTextOnArc = (canvas, text, radius, startAngle, endAngle, rotationOffset) => {
    const ctx = canvas.getContext('2d');

    // Настройки текста
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff'; // Белый цвет текста
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Расчет шага угла для каждого символа
    const angleStep = (endAngle - startAngle) / text.length;

    for (let i = 0; i < text.length; i++) {
      const angle = startAngle + angleStep * i + rotationOffset;
      const x = canvas.width / 2 + radius * Math.cos(angle);
      const y = canvas.height / 2 + radius * Math.sin(angle);

      // Поворачиваем текст на угол, который делает его параллельным касательной к дуге
      const rotationAngle = angle - Math.PI / 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotationAngle); // Поворачиваем текст
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      let rotationOffset = 0; // Угол поворота для анимации
      let animationFrameId; // ID текущего кадра анимации

      // Тексты
      const textTop = 'Светя другим, сгораю сам'.split('').reverse().join('');
      const textBottom = 'Aliis intervendo consumer cam';

      // Радиус для обоих текстов
      const radius = 150;

      // Углы для верхнего текста
      const topStartAngle = Math.PI / 12; // 15°
      const topEndAngle = (11 / 12) * Math.PI; // 165°

      // Углы для нижнего текста
      const bottomStartAngle = (13 / 12) * Math.PI; // 195°
      const bottomEndAngle = (23 / 12) * Math.PI; // 345°

      // Бесконечная анимация
      const animate = () => {
        if (isAnimationComplete) return; // Останавливаем анимацию, если завершена

        // Очищаем канвас перед каждым кадром
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем верхний текст
        drawTextOnArc(canvas, textTop, radius, topStartAngle, topEndAngle, rotationOffset);

        // Рисуем нижний текст
        drawTextOnArc(canvas, textBottom, radius, bottomStartAngle, bottomEndAngle, rotationOffset);

        // Увеличиваем угол поворота
        rotationOffset += 0.02618;

        // Если угол превышает 2π, сбрасываем его на 0
        if (rotationOffset > Math.PI * 2) {
          rotationOffset -= Math.PI * 2;
        }

        // Запрашиваем следующий кадр анимации
        animationFrameId = requestAnimationFrame(animate);
      };

      // Запускаем анимацию
      animate();

      return () => cancelAnimationFrame(animationFrameId); // Остановка анимации при размонтировании
    }
  }, [isAnimationComplete]);

  return (
    <div className={`animate-container ${isAnimationComplete ? 'fade-out' : ''}`}>
      <div className="canvas-container">
        {/* Канвас для текста */}
        <canvas
          ref={canvasRef}
          className="canvas"
          width={500}
          height={500}
        />

        {/* SVG-изображение в центре */}
        <Hart className="hart" />
      </div>
    </div>
  );
};

export default CircleAnimation;