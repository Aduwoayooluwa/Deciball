import React from 'react';
import { RefreshCw } from 'lucide-react';
import type { GameState } from '../types/game-types';

interface GameOverProps {
  gameStateRef: React.RefObject<GameState>;
  resetGame: () => void;
}

export function GameOver({ gameStateRef, resetGame }: GameOverProps) {
    if (!gameStateRef.current) return null;
  
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg text-center mx-4 md:mx-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Game Over!</h2>
          <p className="text-base md:text-lg text-gray-600 mb-4">Final Score: {gameStateRef.current.score}</p>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 mx-auto text-sm md:text-base"
          >
            <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
            Play Again
          </button>
        </div>
      </div>
    );
  }