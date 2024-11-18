import { useCallback, useRef, useState } from 'react';
import type { GameState } from '../types/game-types';

export function useAudio(
    gameStateRef: React.RefObject<GameState>,
    setIsListening: (value: boolean) => void,
    setShowInstructions: (value: boolean) => void,
    setIsGameOver: (value: boolean) => void
  ) {
    const streamRef = useRef<MediaStream | null>(null);

    const [audioStarted, setAudioStarted] = useState(false);
  
    const startAudio = useCallback(async () => {
      if (!gameStateRef.current) return;
  
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(streamRef.current);
        
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        gameStateRef.current.audioContext = audioContext;
        gameStateRef.current.analyser = analyser;
        gameStateRef.current.microphone = microphone;
        
        setIsListening(true);
        setShowInstructions(false);
        setAudioStarted(true)
        setIsGameOver(false);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }, [gameStateRef, setIsListening, setShowInstructions, setIsGameOver]);
  
    const stopAudio = useCallback(() => {
      if (!gameStateRef.current) return;
  
      if (gameStateRef.current.microphone) {
        gameStateRef.current.microphone.disconnect();
        if (gameStateRef.current.audioContext?.state !== 'closed') {
          gameStateRef.current.audioContext?.close();
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        setIsListening(false);
      }
    }, [gameStateRef, setIsListening]);
  
    return { startAudio, stopAudio, audioStarted };
  }