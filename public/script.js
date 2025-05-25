// Terminal Typing Trainer

// List of terminal commands to practice
const commands = [
  'git clone https://github.com/username/repo.git',
  'npm install --save-dev typescript',
  'docker run -p 8080:80 nginx',
  'ssh user@hostname -p 2222',
  'sudo apt-get update && sudo apt-get upgrade'
];

// DOM elements
const commandDisplay = document.getElementById('command-display');
const commandInput = document.getElementById('command-input');
const currentCommandIndex = document.getElementById('current-command-index');
const totalCommands = document.getElementById('total-commands');
const timerElement = document.getElementById('timer');
const timeElement = document.getElementById('time');
const resultsElement = document.getElementById('results');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const messageElement = document.getElementById('message');
const tryAgainButton = document.getElementById('try-again');

// Variables to track game state
let currentCommand = '';
let commandIndex = 0;
let startTime = null;
let endTime = null;
let timerInterval = null;
let totalKeystrokes = 0;
let correctKeystrokes = 0;
let elapsedTime = 0;

// Initialize the game
function init() {
  // Set total commands
  totalCommands.textContent = commands.length;
  
  // Shuffle commands array to get different order each time
  shuffleArray(commands);
  
  // Start with the first command
  loadCommand(0);
  
  // Focus on input field
  commandInput.focus();
  
  // Reset stats
  totalKeystrokes = 0;
  correctKeystrokes = 0;
  elapsedTime = 0;
  
  // Hide results
  resultsElement.classList.add('hidden');
  
  // Reset timer display
  timeElement.textContent = '0';
  timerElement.classList.add('hidden');
}

// Load a command
function loadCommand(index) {
  if (index >= commands.length) {
    // Game completed, show results
    showResults();
    return;
  }
  
  commandIndex = index;
  currentCommand = commands[index];
  currentCommandIndex.textContent = index + 1;
  
  // Display the command with character spans for styling
  commandDisplay.innerHTML = '';
  for (let i = 0; i < currentCommand.length; i++) {
    const charSpan = document.createElement('span');
    charSpan.classList.add('char');
    charSpan.textContent = currentCommand[i];
    commandDisplay.appendChild(charSpan);
  }
  
  // Clear input field
  commandInput.value = '';
}

// Check input against current command
function checkInput() {
  const inputValue = commandInput.value;
  const chars = commandDisplay.querySelectorAll('.char');
  
  let allCorrect = true;
  
  // Start timer on first keystroke
  if (inputValue.length === 1 && startTime === null) {
    startTimer();
  }
  
  for (let i = 0; i < chars.length; i++) {
    if (i < inputValue.length) {
      // Count keystrokes
      if (i === inputValue.length - 1) {
        totalKeystrokes++;
        if (inputValue[i] === currentCommand[i]) {
          correctKeystrokes++;
        }
      }
      
      // Character was typed
      if (inputValue[i] === currentCommand[i]) {
        chars[i].className = 'char correct';
      } else {
        chars[i].className = 'char incorrect';
        allCorrect = false;
      }
    } else {
      // Character not typed yet
      chars[i].className = 'char';
    }
  }
  
  // Check if command is completed correctly
  if (inputValue.length === currentCommand.length && allCorrect) {
    // Move to the next command after a short delay
    setTimeout(() => {
      loadCommand(commandIndex + 1);
    }, 500);
  }
}

// Show results at the end
function showResults() {
  // Stop the timer
  clearInterval(timerInterval);
  endTime = new Date();
  
  // Calculate WPM and accuracy
  const minutes = elapsedTime / 60;
  // Assuming 5 characters per word (standard measure)
  const words = totalKeystrokes / 5;
  const wpm = Math.round(words / minutes);
  const accuracy = Math.round((correctKeystrokes / totalKeystrokes) * 100);
  
  // Display results
  wpmElement.textContent = wpm;
  accuracyElement.textContent = accuracy;
  
  // Fun message based on performance
  let message = '';
  if (wpm > 60 && accuracy > 90) {
    message = 'Phenomenal! You type like you're hacking the mainframe!';
  } else if (wpm > 40 && accuracy > 80) {
    message = 'Great job! You'd make a fine terminal warrior!';
  } else if (wpm > 20) {
    message = 'Not bad! Keep practicing those terminal commands!';
  } else {
    message = 'You're on the right path. More practice and you'll be a terminal ninja!';
  }
  
  messageElement.textContent = message;
  
  // Show results section
  resultsElement.classList.remove('hidden');
  
  // Hide the input field
  commandInput.style.display = 'none';
}

// Start the timer
function startTimer() {
  startTime = new Date();
  timerElement.classList.remove('hidden');
  
  timerInterval = setInterval(() => {
    elapsedTime = Math.floor((new Date() - startTime) / 1000);
    timeElement.textContent = elapsedTime;
  }, 1000);
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Event listeners
commandInput.addEventListener('input', checkInput);

tryAgainButton.addEventListener('click', () => {
  // Reset game state
  startTime = null;
  endTime = null;
  clearInterval(timerInterval);
  
  // Show input field again
  commandInput.style.display = 'block';
  
  // Start fresh
  init();
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);

// Focus input when clicking anywhere in the terminal
document.querySelector('.terminal').addEventListener('click', () => {
  commandInput.focus();
});