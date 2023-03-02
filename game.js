const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0,
  questionCounter = 0;
let availableQuestions = [];

let questions = [];

let MAX_QUESTIONS;

fetch("questions.json")
  .then((res) => res.json())
  .then((loadedQuestions) => {
    questions = loadedQuestions;
    MAX_QUESTIONS = questions.length;
    start();
  })
  .catch((err) => {
    console.error(err);
  });

const CORRECT_BONUS = 10;
start = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("recent-score", score);
    // Go to the end page
    return window.location.assign("/end.html");
  }
  questionCounter++;
  questionCounterText.textContent = `${questionCounter}/${MAX_QUESTIONS}`;
  // Update progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.textContent = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.textContent = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    incrementScore(classToApply === "correct" ? CORRECT_BONUS : 0);

    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1200);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.textContent = score;
};
