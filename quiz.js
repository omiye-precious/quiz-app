const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const homeBtn = document.getElementById("home-btn");
const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const highScoreEl = document.getElementById("high-score");
const finalScoreEl = document.getElementById("final-score");
const categorySelect = document.getElementById("category");
const resetScoreBtn = document.getElementById("reset-score");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

let questions = {
  general: [
    { question: "What color is the sky?", answers: ["Blue", "Red", "Green", "Pink"], correct: 0 },
    { question: "How many days in a week?", answers: ["5", "6", "7", "8"], correct: 2 },
    { question: "Which animal barks?", answers: ["Cat", "Dog", "Cow", "Goat"], correct: 1 },
    { question: "What planet do we live on?", answers: ["Mars", "Earth", "Venus", "Jupiter"], correct: 1 },
  ],
  science: [
    { question: "What gas do plants produce?", answers: ["Carbon", "Oxygen", "Nitrogen", "Hydrogen"], correct: 1 },
    { question: "Boiling point of water?", answers: ["90°C", "100°C", "80°C", "110°C"], correct: 1 },
    { question: "What do bees make?", answers: ["Butter", "Oil", "Honey", "Milk"], correct: 2 },
    { question: "What is H2O?", answers: ["Oxygen", "Hydrogen", "Water", "Salt"], correct: 2 },
  ],
  tech: [
    { question: "What does HTML stand for?", answers: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Markup Link", "None"], correct: 0 },
    { question: "Who founded Microsoft?", answers: ["Steve Jobs", "Mark Zuckerberg", "Bill Gates", "Elon Musk"], correct: 2 },
    { question: "Which is a coding language?", answers: ["Python", "Spanish", "English", "French"], correct: 0 },
    { question: "What is the brain of the computer?", answers: ["Mouse", "Monitor", "CPU", "Keyboard"], correct: 2 },
  ]
};

let currentQuestionIndex = 0;
let currentScore = 0;
let currentCategory = "general";
let timer;
let timeLeft = 15;

startBtn.addEventListener("click", () => {
  currentCategory = categorySelect.value;
  currentScore = 0;
  currentQuestionIndex = 0;
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  loadQuestion();
});

restartBtn.addEventListener("click", () => {
  stopAllSounds();
  currentQuestionIndex = 0;
  currentScore = 0;
  endScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  loadQuestion();
});

homeBtn.addEventListener("click", () => {
  stopAllSounds();
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

resetScoreBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("quizHighScore");
  highScoreEl.textContent = 0;
});

function stopAllSounds() {
  correctSound.pause();
  wrongSound.pause();
  correctSound.currentTime = 0;
  wrongSound.currentTime = 0;
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  updateTimer();
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft === 0) {
      showNextQuestion();
    }
  }, 1000);

  const q = questions[currentCategory][currentQuestionIndex];
  questionEl.textContent = q.question;
  answerButtons.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.classList.add("btn");
    btn.addEventListener("click", () => selectAnswer(index));
    answerButtons.appendChild(btn);
  });

  scoreEl.textContent = currentScore;
}

function updateTimer() {
  if (timerEl) timerEl.textContent = timeLeft;
}

function selectAnswer(index) {
  clearInterval(timer);
  stopAllSounds(); // prevent overlapping

  const correctIndex = questions[currentCategory][currentQuestionIndex].correct;

  if (index === correctIndex) {
    correctSound.play();
    currentScore++;
  } else {
    wrongSound.play();
  }

  setTimeout(() => {
    showNextQuestion();
  }, 500);
}

function showNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions[currentCategory].length) {
    loadQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  quizScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");
  finalScoreEl.textContent = currentScore;

  const highScore = parseInt(localStorage.getItem("quizHighScore")) || 0;
  if (currentScore > highScore) {
    localStorage.setItem("quizHighScore", currentScore);
  }
  highScoreEl.textContent = localStorage.getItem("quizHighScore");
}

// Initialize high score on first load
document.addEventListener("DOMContentLoaded", () => {
  const storedScore = localStorage.getItem("quizHighScore") || 0;
  highScoreEl.textContent = storedScore;
});
