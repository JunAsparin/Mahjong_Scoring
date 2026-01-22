let players = JSON.parse(localStorage.getItem("mahjongPlayers"));
let chipValue = Number(localStorage.getItem("chipValue"));
let round = Number(localStorage.getItem("currentRound"));

document.getElementById("roundNumber").textContent = round;

const playersDiv = document.getElementById("players");
const winnerSelect = document.getElementById("winnerSelect");

players.forEach((p, i) => {
  const div = document.createElement("div");
  div.className = "player";
  div.innerHTML = `
    <strong>${p.name}</strong><br>
    ${p.chips} chips<br>
    $${(p.chips * chipValue).toFixed(2)}
  `;
  playersDiv.appendChild(div);

  const option = document.createElement("option");
  option.value = i;
  option.textContent = p.name;
  winnerSelect.appendChild(option);
});

function endRound() {
  round++;
  localStorage.setItem("currentRound", round);
  alert("Round ended. (Next rounds logic coming next)");
}
