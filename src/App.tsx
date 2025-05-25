import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// Sample terminal commands
const COMMANDS = [
  'npm install',
  'git commit -m "initial commit"',
  'ls -la',
  'docker build -t myapp .',
  'ssh user@192.168.1.100'
];

function App() {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [incorrectKeystrokes, setIncorrectKeystrokes] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input field when game starts
  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Start the game
  const startGame = useCallback(() => {
    setCurrentCommandIndex(0);
    setInputValue('');
    setStartTime(Date.now());
    setEndTime(null);
    setTotalKeystrokes(0);
    setIncorrectKeystrokes(0);
    setGameState('playing');
  }, []);

  // Handle typing
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;
    
    const currentCommand = COMMANDS[currentCommandIndex];
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Count keystrokes for accuracy calculation
    if (newValue.length > inputValue.length) {
      setTotalKeystrokes(prev => prev + 1);
      
      // Check if new character is correct
      const newCharIndex = newValue.length - 1;
      if (newCharIndex >= 0 && newCharIndex < currentCommand.length && 
          newValue[newCharIndex] !== currentCommand[newCharIndex]) {
        setIncorrectKeystrokes(prev => prev + 1);
      }
    }
    
    // Check if command is completed correctly
    if (newValue === currentCommand) {
      if (currentCommandIndex === COMMANDS.length - 1) {
        // Game completed
        setEndTime(Date.now());
        setGameState('finished');
      } else {
        // Next command
        setCurrentCommandIndex(prev => prev + 1);
        setInputValue('');
      }
    }
  }, [currentCommandIndex, gameState, inputValue]);

  // Calculate typing stats
  const calculateStats = () => {
    if (!startTime || !endTime) return { wpm: 0, accuracy: 100 };
    
    const timeInMinutes = (endTime - startTime) / 1000 / 60;
    const totalChars = COMMANDS.join('').length;
    const wpm = Math.round(totalChars / 5 / timeInMinutes); // Standard WPM calculation (5 chars = 1 word)
    
    // Calculate accuracy
    const accuracy = totalKeystrokes > 0 
      ? Math.round(((totalKeystrokes - incorrectKeystrokes) / totalKeystrokes) * 100) 
      : 100;
    
    return { wpm, accuracy };
  };

  // Get the current command to display
  const currentCommand = COMMANDS[currentCommandIndex] || '';
  
  // Generate highlighted text for current input
  const generateHighlightedText = () => {
    if (!currentCommand) return null;
    
    return (
      <div className="terminal-line current-command">
        {currentCommand.split('').map((char, index) => {
          if (index >= inputValue.length) {
            // Character not yet typed
            return <span key={index} className="char-neutral">{char}</span>;
          } else if (char === inputValue[index]) {
            // Correctly typed character
            return <span key={index} className="char-correct">{char}</span>;
          } else {
            // Incorrectly typed character
            return <span key={index} className="char-incorrect">{inputValue[index]}</span>;
          }
        })}
      </div>
    );
  };

  // Generate a fun message based on performance
  const getFunMessage = () => {
    const { wpm } = calculateStats();
    
    if (wpm >= 80) return "Incredible! You type like you're hacking the mainframe!";
    if (wpm >= 60) return "Elite typing skills detected! Terminal mastery level: PRO";
    if (wpm >= 40) return "Good job, command line warrior!";
    return "Nice typing! Keep practicing those terminal commands!";
  };

  const { wpm, accuracy } = calculateStats();

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">~/terminal-typing-trainer</div>
        <div className="terminal-controls">
          <span className="control close"></span>
          <span className="control minimize"></span>
          <span className="control maximize"></span>
        </div>
      </div>
      
      <div className="terminal-body">
        {gameState === 'ready' && (
          <div className="terminal-welcome">
            <div className="terminal-line">Welcome to Terminal Typing Trainer!</div>
            <div className="terminal-line">Practice typing common terminal commands.</div>
            <div className="terminal-line blink">Press START to begin...</div>
          </div>
        )}
        
        {gameState === 'playing' && (
          <div className="terminal-game">
            <div className="terminal-line prompt">$ {generateHighlightedText()}</div>
            <div className="terminal-line">
              <span className="prompt">$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleChange}
                className="terminal-input"
                autoFocus
              />
            </div>
            <div className="terminal-line">
              Command {currentCommandIndex + 1}/{COMMANDS.length}
            </div>
          </div>
        )}
        
        {gameState === 'finished' && (
          <div className="terminal-results">
            <div className="terminal-line success">Command sequence completed!</div>
            <div className="terminal-line">
              <span className="stat-label">WPM:</span> {wpm}
            </div>
            <div className="terminal-line">
              <span className="stat-label">Accuracy:</span> {accuracy}%
            </div>
            <div className="terminal-line message">{getFunMessage()}</div>
          </div>
        )}
      </div>
      
      <div className="terminal-footer">
        <button 
          className="terminal-button"
          onClick={gameState === 'playing' ? () => {} : startGame}
        >
          {gameState === 'ready' ? 'START' : gameState === 'playing' ? 'TYPING...' : 'TRY AGAIN'}
        </button>
      </div>
    </div>
  );
}

export default App;