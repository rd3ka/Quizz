const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");

const loader = document.getElementById("loader");
const game = document.getElementById("game");

const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0,
  questionCounter = 0,
  seconds = 15;
let availableQuestions = [],
  questions = [];

let MAX_QUESTIONS, timer;

fetch(
  "https://opentdb.com/api.php?amount=15&category=31&difficulty=easy&type=multiple"
)
  .then((res) => res.json())
  .then((data) => {
    console.log(data.results);
    questions = data.results.map((q) => {
      const formattedQ = {
        question: q.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
      };

      const answerChoices = [...q.incorrect_answers];
      formattedQ.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(formattedQ.answer - 1, 0, q.correct_answer);

      answerChoices.forEach((choice, index) => {
        formattedQ["choice" + (index + 1)] = choice
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'");
      });
      return formattedQ;
    });
    MAX_QUESTIONS = questions.length;
    game.classList.remove("hidden");
    loader.classList.add("hidden");
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
    return window.location.assign("../html/end.html");
  }
  questionCounter++;
  //questionCounter to be used to keep track of the number of questions
  questionCounterText.textContent = `${questionCounter}/${MAX_QUESTIONS}`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.textContent = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.textContent = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
  seconds = 15;
  startTimer();
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
      clearInterval(timer);
      getNewQuestion();
    }, 500);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.textContent = score;
};

startTimer = () => {
  timer = setInterval(() => {
    seconds > 9
      ? (document.getElementById("safeTimerDisplay").textContent =
          "00:" + seconds)
      : (document.getElementById("safeTimerDisplay").textContent =
          "00:0" + seconds);
    seconds--;

    // Use progressBar to show time left
    let totalTime = 15;
    progressBarFull.style.width = `${
      ((totalTime - seconds) / totalTime) * 100
    }%`;

    if (seconds < 0) {
      clearInterval(timer);
      incrementScore(0);
      getNewQuestion();
    }
  }, 1000);
};
