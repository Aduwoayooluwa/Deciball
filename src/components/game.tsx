import { useEffect, useRef, useState } from 'react';
import { Volume2, Mic, MicOff, HelpCircle } from 'lucide-react';
import { GameCanvas } from './game-canvas';
import { GameOver } from './game-over';
import { Instructions } from './instructions';
import { useAudio } from '../hooks/useAudio';
import type { GameState } from '../types/game-types';
import ReactGA from 'react-ga';

function Game() {

    const TRACKING_ID = import.meta.env.PUBLIC_TRACKING_ID;
    
    ReactGA.initialize(TRACKING_ID);

    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);

  const [isListening, setIsListening] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const gameStateRef = useRef<GameState>({
    ball: { x: 100, y: 300, radius: 20 },
    obstacles: [
      { x: 400, width: 30, height: 200 },
      { x: 700, width: 30, height: 250 },
      { x: 1000, width: 30, height: 180 },
    ],
    score: 0,
    audioContext: null,
    analyser: null,
    microphone: null,
  });

  const { startAudio, stopAudio } = useAudio(
    gameStateRef,
    setIsListening,
    setShowInstructions,
    setIsGameOver
  );

  const resetGame = () => {
    gameStateRef.current.ball = { x: 100, y: 300, radius: 20 };
    gameStateRef.current.obstacles = [
      { x: 400, width: 30, height: 200 },
      { x: 700, width: 30, height: 250 },
      { x: 1000, width: 30, height: 180 },
    ];
    gameStateRef.current.score = 0;
    setIsGameOver(false);
    startAudio();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm md:shadow-xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-indigo-600" />
              DeciBall
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInstructions(true)}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Show Instructions"
              >
                <HelpCircle className="w-6 h-6 text-gray-600" />
              </button>
              {!isGameOver && (
                <button
                  onClick={isListening ? stopAudio : startAudio}
                  className={`p-2 rounded-full ${
                    isListening ? 'bg-red-100 hover:bg-red-200' : 'bg-green-100 hover:bg-green-200'
                  }`}
                  title={isListening ? 'Stop' : 'Start'}
                >
                  {isListening ? (
                    <MicOff className="w-6 h-6 text-red-600" />
                  ) : (
                    <Mic className="w-6 h-6 text-green-600" />
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <GameCanvas
              isListening={isListening}
              isGameOver={isGameOver}
              gameStateRef={gameStateRef}
              setIsGameOver={setIsGameOver}
              stopAudio={stopAudio}
            />
            {isGameOver && (
              <GameOver
                gameStateRef={gameStateRef}
                resetGame={resetGame}
              />
            )}
          </div>
        </div>

        {showInstructions && (
          <Instructions onClose={() => setShowInstructions(false)} />
        )}
      </div>
    </div>
  );
}

export default Game;