'use client';

import React, { useEffect, useRef } from 'react';

interface WaveGradientBackgroundProps {
  children: React.ReactNode;
}

const WaveGradientBackground: React.FC<WaveGradientBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;
    
    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Define gradient colors - various greens instead of blues
    const colors = [
      '#034B03', // Dark Green
      '#0B820B', // Medium Green
      '#00B300', // Bright Green
      '#49D049', // Light Green
      '#98E698', // Pale Green
      '#C8F7C8', // Very Light Green
    ];
    
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw multiple wave layers
      const layers = 5;
      const waveHeight = canvas.height / 12;
      
      for (let l = 0; l < layers; l++) {
        const speed = 0.0003 * (l + 1);
        const currentTime = time * speed;
        const waveFrequency = 0.5 + l * 0.2;
        const opacity = 0.8 - l * 0.1;
        
        ctx.fillStyle = colors[l % colors.length];
        ctx.globalAlpha = opacity;
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        // Draw wave
        for (let x = 0; x < canvas.width; x += 5) {
          const y = Math.sin(x * waveFrequency * 0.01 + currentTime) * waveHeight;
          ctx.lineTo(x, canvas.height - (canvas.height / (l + 1)) + y);
        }
        
        // Complete the path
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        ctx.fill();
      }
      
      // Increment time
      time += 10;
      
      animationFrameId = window.requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="relative w-full min-h-screen">
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10"
      />
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default WaveGradientBackground;