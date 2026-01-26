// ---------- LOAD STATE ----------
let players = JSON.parse(localStorage.getItem("mahjongPlayers")) || [];
let chipValue = Number(localStorage.getItem("chipValue")) || 0.25;
let round = Number(localStorage.getItem("currentRound")) || 1;

players.forEach(p => {
  if (p.markers == null) p.markers = 0;
});

// ---------- DOM ----------
const playerCards = document.getElementById("playerCards");
const entriesDiv = document.getElementById("entries");
const markerInputs = document.getElementById("starInputs");
const roundLabel = document.getElementById("roundNumber");

// ---------- INIT ----------
roundLabel.textContent = round;
let roundEntries = [];

// ---------- RENDER PLAYER TRACKER ----------
function renderPlayers() {
  playerCards.innerHTML = "";

  players.forEach(p => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <div>${p.chips} chips</div>
      <div class="money">$${(p.chips * chipValue).toFixed(2)}</div>
      <div>Markers: ${p.markers}</div>
    `;
    playerCards.appendChild(card);
  });
}

// ---------- ENTRY LOGIC ----------
function setupEntryLogic(entry) {
  const inputs = Array.from(entry.querySelectorAll("input"));
  const moneyLabels = Array.from(entry.querySelectorAll(".money-preview"));

  let activeWinner = null;

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      let val = Math.round(Number(input.value) || 0);

      // If this input is positive, it becomes the winner
      if (val > 0) {
        activeWinner = index;
      }

      // If no active winner, reset visuals only
      if (activeWinner === null) {
        moneyLabels.forEach(l => (l.textContent = "$0.00"));
        return;
      }

      // If editing a loser, do nothing
      if (index !== activeWinner) return;

      const playersCount = inputs.length;
      const losers = playersCount - 1;

      if (val % losers !== 0) return;

      const lossEach = -(val / losers);

      inputs.forEach((inp, i) => {
        if (i === activeWinner) {
          inp.value = val;
          moneyLabels[i].textContent =
            "+$" + (val * chipValue).toFixed(2);
        } else {
          inp.value = lossEach;
          moneyLabels[i].textContent =
            "$" + (lossEach * chipValue).toFixed(2);
        }
      });
    });
  });
}

// ---------- ADD ENTRY ----------
function addEntry() {
  const entry = document.createElement("div");
  entry.className = "entry";

  entry.innerHTML = `
    <div class="entry-grid">
      ${players.map(
        (p, i) => `
        <div class="entry-player">
          <strong>${p.name}</strong>
          <input type="number" step="1" value="0" data-index="${i}">
          <div class="money-preview">$0.00</div>
        </div>
      `
      ).join("")}
    </div>
  `;

  // Delete button (not first entry)
  if (roundEntries.length > 0) {
    const del = document.createElement("button");
    del.className = "delete-entry";
    del.textContent = "Delete Entry";
    del.onclick = () => {
      entriesDiv.removeChild(entry);
      roundEntries = roundEntries.filter(e => e !== entry);
    };
    entry.appendChild(del);
  }

  setupEntryLogic(entry);

  entriesDiv.appendChild(entry);
  roundEntries.push(entry);
}

// ---------- MARKERS ----------
function renderMarkers() {
  markerInputs.innerHTML = "";
  players.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "star-row";
    row.innerHTML = `
      <span>${p.name}</span>
      <input type="number" min="0" step="1" value="0" data-index="${i}">
    `;
    markerInputs.appendChild(row);
  });
}

// ---------- END ROUND ----------
function endRound() {
  roundEntries.forEach(entry => {
    const inputs = entry.querySelectorAll("input");

    let winner = -1;
    let winChips = 0;

    inputs.forEach((inp, i) => {
      const v = Number(inp.value);
      if (v > 0) {
        winner = i;
        winChips = v;
      }
    });

    if (winner === -1) return;

    const lossEach = winChips / (players.length - 1);
    if (!Number.isInteger(lossEach)) {
      alert("Invalid chip split.");
      throw new Error("Invalid split");
    }

    players[winner].chips += winChips;
    players.forEach((p, i) => {
      if (i !== winner) p.chips -= lossEach;
    });
  });

  // Apply markers
  document.querySelectorAll("#starInputs input").forEach(input => {
    players[input.dataset.index].markers += Number(input.value);
  });

  // Jai Alai check
  if (players.some(p => p.markers >= 5)) {
    localStorage.setItem("mahjongPlayers", JSON.stringify(players));
    window.location.href = "summary.html";
    return;
  }

  // Next round
  round++;
  localStorage.setItem("currentRound", round);
  localStorage.setItem("mahjongPlayers", JSON.stringify(players));

  roundEntries = [];
  entriesDiv.innerHTML = "";

  renderPlayers();
  renderMarkers();
  roundLabel.textContent = round;
  addEntry();
}

// ---------- BUTTONS ----------
document.getElementById("addEntry").onclick = addEntry;
document.getElementById("endRound").onclick = endRound;

document.getElementById("restartGame").onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};

function renderPlayerCards(players, chipValue) {
  const container = document.getElementById("playerCards");
  container.innerHTML = "";

  players.forEach(p => {
    const money = (p.chips * chipValue).toFixed(2);

    const card = document.createElement("div");
    card.className = "player-card";

    card.innerHTML = `
      <h3>${p.name}</h3>
      <div class="player-stats">
        <span>Chips: ${p.chips}</span>
        <span>$${money}</span>
        <span>Markers: ${p.markers}</span>
      </div>
    `;

    container.appendChild(card);
  });
}



// ---------- START ----------
renderPlayers();
renderMarkers();
addEntry();

