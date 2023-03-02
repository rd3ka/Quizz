const username = document.getElementById("username");
const saveScore = document.getElementById("save-score");
const finalScore = document.getElementById("finalscore");
const recentScore = localStorage.getItem("recent-score");

const highScores = JSON.parse(localStorage.getItem("highScore")) || [];

finalScore.textContent = recentScore;

const MaximumNumber_HighScore = 5;

username.addEventListener("keyup", () => {
  saveScore.disabled = !username.value;
});

saveHighScore = (e) => {
  console.log("save!");
  e.preventDefault();

  const score = {
    score: recentScore,
    name: username.value,
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MaximumNumber_HighScore);

  localStorage.setItem("highScore", JSON.stringify(highScores));
  window.location.assign("../");
};
