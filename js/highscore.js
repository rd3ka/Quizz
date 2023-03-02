const highScoresList = document.getElementById("highScoreList");
const highScores = JSON.parse(localStorage.getItem("highscores")) || [];

highScoresList.innerHTML = highScores
  .map((score) => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");
