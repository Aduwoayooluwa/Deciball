interface InstructionsProps {
  onClose: () => void;
}

export function Instructions({ onClose }: InstructionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 mx-4 md:mx-0">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">How to Play</h2>
      <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base text-gray-700">
        <li>1. Click the microphone button to start</li>
        <li>2. Make noise or speak to control the ball's height</li>
        <li>3. The louder your voice, the higher the ball jumps</li>
        <li>4. Avoid hitting the blue obstacles</li>
        <li>5. Score points by surviving longer</li>
      </ul>
      <button
        onClick={onClose}
        className="mt-3 md:mt-4 w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm md:text-base"
      >
        Got it!
      </button>
    </div>
  );
}