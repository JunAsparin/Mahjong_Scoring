const players = JSON.parse(localStorage.getItem("mahjongPlayers")) || [];
const chipValue = Number(localStorage.getItem("chipValue")) || 0.25;
let currentRound = Number(localStorage.getItem("currentRound")) || 1;

const playerSummaries = document.getElementById("playerSummaries");
const winnerSelect = document.getElementById("winnerSelect");
const roundTitle = document.getElementById("roundTitle");

function renderGame() {
  playerSummaries.innerHTML = "";
  winnerSelect.innerHTML = "";

  players.forEach((p, i) => {
    playerSummaries.innerHTML += `
      <div class="player-summary">
        <strong>${p.name}</strong>
        <div class="money">$${(p.chips * chipValue).toFixed(2)}</div>
        <div class="chips">${p.chips} chips</div>
        <div class="stars">
          ${"⭐".repeat(p.stars)}${"✨".repeat(p.bonusStars)}
        </div>
      </div>
    `;

    winnerSelect.innerHTML += `<option value="${i}">${p.name}</option>`;
  });

  roundTitle.textContent = `Round ${currentRound} of 5`;
}

function endRound() {
  const winnerIndex = Number(winnerSelect.value);
  const winChips = Number(document.getElementById("roundWinChips").value);
  const bonusStar = document.getElementById("bonusStar").checked;

  if (!winChips || winChips <= 0) {
    alert("Enter chips won this round.");
    return;
  }

  const lossPerPlayer = winChips / (players.length - 1);

  players.forEach((p, i) => {
    if (i === winnerIndex) {
      p.chips += winChips;
      p.stars += 1;
      if (bonusStar) p.bonusStars += 1;
    } else {
      p.chips -= lossPerPlayer;
    }
  });

  currentRound++;
  localStorage.setItem("currentRound", currentRound);
  localStorage.setItem("mahjongPlayers", JSON.stringify(players));

  if (currentRound > 5) {
    alert("🀄 Jai Alai reached! Game over.");
    return;
  }

  document.getElementById("roundWinChips").value = "";
  document.getElementById("bonusStar").checked = false;

  renderGame();
}

renderGame();
