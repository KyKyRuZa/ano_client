import React, { useEffect, useRef } from 'react';
import "../style/home/loading.css";
import { ReactComponent as Hart } from "../style/assets/logo.svg";

const CircleAnimation = ({ isAnimationComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isAnimationComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAnimationComplete]);

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

      const textTop = 'Светя другим, сгораю сам'.split('').reverse().join('');
      const textBottom = 'Aliis intervendo consumer cam';

      const radius = 150;

      const topStartAngle = Math.PI / 12;
      const topEndAngle = (11 / 12) * Math.PI;

      const bottomStartAngle = (13 / 12) * Math.PI;
      const bottomEndAngle = (23 / 12) * Math.PI;

      const animate = () => {
        if (isAnimationComplete) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawTextOnArc(canvas, textTop, radius, topStartAngle, topEndAngle, rotationOffset);
        drawTextOnArc(canvas, textBottom, radius, bottomStartAngle, bottomEndAngle, rotationOffset);

        rotationOffset += 0.02618;

        if (rotationOffset > Math.PI * 2) {
          rotationOffset -= Math.PI * 2;
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [isAnimationComplete]);

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