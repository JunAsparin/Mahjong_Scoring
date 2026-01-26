const players = JSON.parse(localStorage.getItem("mahjongPlayers")) || [];
const chipValue = Number(localStorage.getItem("chipValue")) || 0.25;

const winnerNameEl = document.getElementById("winnerName");
const summaryList = document.getElementById("summaryList");

// Determine winner by MONEY (not markers)
let winner = players[0];
let highestMoney = winner.chips * chipValue;

players.forEach(p => {
  const money = p.chips * chipValue;
  if (money > highestMoney) {
    highestMoney = money;
    winner = p;
  }
});

winnerNameEl.textContent = `Winner: ${winner.name}`;

// Render summary
players
  .sort((a, b) => (b.chips * chipValue) - (a.chips * chipValue))
  .forEach(p => {
    const row = document.createElement("div");
    row.className = "summary-row";

    row.innerHTML = `
      <strong>${p.name}</strong>
      <span>${p.chips} chips</span>
      <span>$${(p.chips * chipValue).toFixed(2)}</span>
      <span>${p.markers} markers</span>
    `;

    summaryList.appendChild(row);
  });

// Restart
document.getElementById("restartGame").onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};
