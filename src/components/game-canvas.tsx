
import React, { useEffect, useRef, useState } from 'react';
import type { GameState } from '../types/game-types';

interface GameCanvasProps {
  isListening: boolean;
  isGameOver: boolean;
  gameStateRef: React.RefObject<GameState>;
  setIsGameOver: (value: boolean) => void;
  stopAudio: () => void;
}

export function GameCanvas({ isListening, isGameOver, gameStateRef, setIsGameOver, stopAudio }: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 1000, height: 500 });
  
    useEffect(() => {
      const updateDimensions = () => {
        const container = canvasRef.current?.parentElement;
        if (container) {
          const { width } = container.getBoundingClientRect();
          const height = Math.min(500, window.innerHeight * 0.6);
          setDimensions({ width, height });
        }
      };
  
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !gameStateRef.current) return;
  
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      const scale = dimensions.width / 1000; 
  
      let animationId: number;
      const gameLoop = () => {
        if (!ctx || !canvas || isGameOver || !gameStateRef.current) return;
  
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        // Get audio data if listening
        if (isListening && gameStateRef.current.analyser) {
          const dataArray = new Uint8Array(gameStateRef.current.analyser.frequencyBinCount);
          gameStateRef.current.analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          
          // Update ball position based on audio input
          gameStateRef.current.ball.y = Math.max(
            gameStateRef.current.ball.radius * scale,
            Math.min(
              canvas.height - gameStateRef.current.ball.radius * scale,
              canvas.height - (average * 2 * (canvas.height / 500))
            )
          );
        }
  
        // Draw ground
        ctx.fillStyle = '#2dd4bf';
        ctx.fillRect(0, canvas.height - 50 * scale, canvas.width, 50 * scale);
  
        // Draw ball
        ctx.beginPath();
        ctx.arc(
          gameStateRef.current.ball.x * scale,
          gameStateRef.current.ball.y,
          gameStateRef.current.ball.radius * scale,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
        ctx.closePath();
  
        // Draw obstacles
        gameStateRef.current.obstacles.forEach((obstacle) => {
          ctx.fillStyle = '#6366f1';
          ctx.fillRect(
            obstacle.x * scale,
            canvas.height - obstacle.height * scale,
            obstacle.width * scale,
            obstacle.height * scale
          );
  
          // Move obstacles
          obstacle.x -= 2;
  
          // Reset obstacle position
          if (obstacle.x + obstacle.width < 0) {
            obstacle.x = canvas.width / scale;
            obstacle.height = 150 + Math.random() * 150;
            if (gameStateRef.current) {
              gameStateRef.current.score++;
            }
          }
  
          // Collision detection
          if (
            gameStateRef.current && gameStateRef.current.ball.x * scale + gameStateRef.current.ball.radius * scale > obstacle.x * scale &&
            gameStateRef.current.ball.x * scale - gameStateRef.current.ball.radius * scale < obstacle.x * scale + obstacle.width * scale &&
            gameStateRef.current.ball.y + gameStateRef.current.ball.radius * scale > canvas.height - obstacle.height * scale
          ) {
            setIsGameOver(true);
            stopAudio();
          }
        });
  
        // Draw score
        ctx.fillStyle = '#1f2937';
        ctx.font = `bold ${24 * scale}px Inter, system-ui, sans-serif`;
        ctx.fillText(`Score: ${gameStateRef.current.score}`, 20 * scale, 40 * scale);
  
        animationId = requestAnimationFrame(gameLoop);
      };
  
      gameLoop();
      return () => cancelAnimationFrame(animationId);
    }, [dimensions, isListening, isGameOver, gameStateRef, setIsGameOver, stopAudio]);
  
    return (
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg bg-gradient-to-b from-sky-200 to-sky-100"
        style={{ height: dimensions.height }}
      />
    );
  }