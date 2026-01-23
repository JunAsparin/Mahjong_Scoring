let players = [
  { name: "", chips: 0, markers: 0, bonusMarkers: 0 },
  { name: "", chips: 0, markers: 0, bonusMarkers: 0 },
  { name: "", chips: 0, markers: 0, bonusMarkers: 0 },
  { name: "", chips: 0, markers: 0, bonusMarkers: 0 }
];

function startGame() {
  const chipValue = Number(document.getElementById("chipValue").value);
  const startingChips = Number(document.getElementById("startingChips").value);

  const inputs = document.querySelectorAll(".seat input");

  players.forEach((p, i) => {
    p.name = inputs[i].value.trim();
  });

  players = players.filter(p => p.name !== "");

  if (players.length < 3) {
    alert("You need at least 3 players.");
    return;
  }

  players.forEach(p => {
    p.chips = startingChips;
    p.markers = 0;
    p.bonusMarkers = 0;
  });

  localStorage.setItem("mahjongPlayers", JSON.stringify(players));
  localStorage.setItem("chipValue", chipValue);
  localStorage.setItem("currentRound", 1);

  window.location.href = "play.html";
}
