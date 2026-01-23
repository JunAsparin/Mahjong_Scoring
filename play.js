// ---------- LOAD STATE ----------
let players = JSON.parse(localStorage.getItem("mahjongPlayers")) || [];
let chipValue = Number(localStorage.getItem("chipValue")) || 0.25;
let round = Number(localStorage.getItem("currentRound")) || 1;

// ---------- DOM ----------
const playerCards = document.getElementById("playerCards");
const entriesDiv = document.getElementById("entries");
const starInputs = document.getElementById("starInputs");
const roundLabel = document.getElementById("roundNumber");

// ---------- INIT ----------
roundLabel.textContent = round;
let roundEntries = [];

// ---------- RENDER PLAYER TRACKER ----------
function renderPlayers() {
  playerCards.innerHTML = "";

  players.forEach(player => {
    const card = document.createElement("div");
    card.className = "player-card";

    card.innerHTML = `
      <h3>${player.name}</h3>
      <div>${player.chips} chips</div>
      <div class="money">$${(player.chips * chipValue).toFixed(2)}</div>
      <div>Stars: ${player.stars}</div>
    `;

    playerCards.appendChild(card);
  });
}

// ---------- ENTRY CREATION ----------
// ---------- ENTRY CREATION ----------
// ---------- ENTRY CREATION ----------
function addEntry() {
  const entry = document.createElement("div");
  entry.className = "entry";

  entry.innerHTML = `
    <div class="entry-grid">
      ${players.map((p, i) => `
        <div class="entry-player">
          <strong>${p.name}</strong>
          <input type="number" step="1" value="0" data-index="${i}">
          <div class="money-preview">$0.00</div>
        </div>
      `).join("")}
    </div>
  `;

  // Only add delete button if this is NOT the original entry
  if (roundEntries.length > 0) { // first entry is original
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Entry";
    deleteBtn.className = "delete-entry";

    deleteBtn.addEventListener("click", () => {
      entriesDiv.removeChild(entry);
      roundEntries = roundEntries.filter(e => e !== entry);
    });

    entry.appendChild(deleteBtn);
  }

  // Update money preview on input
  entry.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      input.value = Math.round(Number(input.value) || 0);
      const money = input.value * chipValue;
      input.nextElementSibling.textContent =
        (money >= 0 ? "+" : "") + "$" + money.toFixed(2);
    });
  });

  entriesDiv.appendChild(entry);
  roundEntries.push(entry);
}



// ---------- STAR INPUTS ----------
function renderStars() {
  starInputs.innerHTML = "";

  players.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "star-row";

    row.innerHTML = `
      <span>${p.name}</span>
      <input type="number" min="0" step="1" value="0" data-index="${i}">
    `;

    starInputs.appendChild(row);
  });
}

// ---------- APPLY ROUND ----------
function endRound() {

  // Apply all entries
  roundEntries.forEach(entry => {
    const inputs = entry.querySelectorAll("input");
    let winnerIndex = -1;
    let winChips = 0;

    inputs.forEach((input, i) => {
      const value = Number(input.value);
      if (value > 0) {
        winnerIndex = i;
        winChips = value;
      }
    });

    if (winnerIndex === -1) return;

    const loss = winChips / (players.length - 1);
    if (!Number.isInteger(loss)) {
      alert("Invalid chip split");
      return;
    }

    players[winnerIndex].chips += winChips;

    players.forEach((p, i) => {
      if (i !== winnerIndex) {
        p.chips -= loss;
      }
    });
  });

  // Apply stars
  document.querySelectorAll("#starInputs input").forEach(input => {
    players[input.dataset.index].stars += Number(input.value);
  });

  // Check Jai Alai
  if (players.some(p => p.stars >= 5)) {
    localStorage.setItem("mahjongPlayers", JSON.stringify(players));
    window.location.href = "summary.html";
    return;
  }

  // Next round
  round++;
  localStorage.setItem("currentRound", round);
  localStorage.setItem("mahjongPlayers", JSON.stringify(players));

  // Reset round UI
  roundEntries = [];
  entriesDiv.innerHTML = "";

  renderPlayers();
  renderStars();
  flashCards();

  roundLabel.textContent = round;
  addEntry();
}

// ---------- VISUAL FEEDBACK ----------
function flashCards() {
  document.querySelectorAll(".player-card").forEach(card => {
    card.style.boxShadow = "0 0 0 2px #74c69d inset";
    setTimeout(() => card.style.boxShadow = "", 300);
  });
}

// ---------- BUTTONS ----------
document.getElementById("addEntry").onclick = addEntry;
document.getElementById("endRound").onclick = endRound;

document.getElementById("restartGame").onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};

// ---------- START ----------
renderPlayers();
renderStars();
addEntry();
