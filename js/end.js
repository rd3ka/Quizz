const username = document.getElementById("username"),
  saveScore = document.getElementById("save-score"),
  finalScore = document.getElementById("finalscore"),
  recentScore = localStorage.getItem("recent-score");

const highScores = JSON.parse(localStorage.getItem("highScore")) || [];
/* Finally Showing Total Score */
finalScore.textContent = recentScore;

/* Hard coding max no. of highscore */
const MaximumNumber_HighScore = 5;

/* score cannot be save without a username */
username.addEventListener("keyup", () => {
  saveScore.disabled = !username.value;
});

/* storing highScore in localStorage */
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
