export interface Ball {
    x: number;
    y: number;
    radius: number;
  }
  
  export interface Obstacle {
    x: number;
    width: number;
    height: number;
  }
  
  export interface GameState {
    ball: Ball;
    obstacles: Obstacle[];
    score: number;
    audioContext: AudioContext | null;
    analyser: AnalyserNode | null;
    microphone: MediaStreamAudioSourceNode | null;
  }