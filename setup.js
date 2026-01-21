let players = [
  { name: "", chips: 0, stars: 0, bonusStars: 0 },
  { name: "", chips: 0, stars: 0, bonusStars: 0 },
  { name: "", chips: 0, stars: 0, bonusStars: 0 },
  { name: "", chips: 0, stars: 0, bonusStars: 0 }
];

function startGame() {
  const chipValue = Number(document.getElementById("chipValue").value);
  const startingChips = Number(document.getElementById("startingChips").value);

  // Read names from table inputs
  const inputs = document.querySelectorAll(".seat input");

  players.forEach((p, i) => {
    p.name = inputs[i].value.trim();
  });

  // Keep only players with names
  players = players.filter(p => p.name !== "");

  if (players.length < 3) {
    alert("You need at least 3 players to start.");
    return;
  }

  players.forEach(p => {
    p.chips = startingChips;
    p.stars = 0;
    p.bonusStars = 0;
  });

  localStorage.setItem("mahjongPlayers", JSON.stringify(players));
  localStorage.setItem("chipValue", chipValue);
  localStorage.setItem("currentRound", 1);

  window.location.href = "play.html";
}
