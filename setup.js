let players = [
  { name: "", chips: 0, stars: 0, bonusStars: 0 },
  { name: "", chips: 0, stars: 0, bonusStars: 0 },
  { name: "", chips: 0, stars: 0, bonusStars: 0 },
  { name: "", chips: 0, stars: 0, bonusStars: 0 }
];

function startGame() {
  const chipValue = Number(document.getElementById("chipValue").value);
  const startingChips = Number(document.getElementById("startingChips").value);

  // Grab ALL seat inputs, regardless of position
  const inputs = document.querySelectorAll(".seat input");

  // Build players dynamically from filled seats
  const players = Array.from(inputs)
    .map(input => input.value.trim())
    .filter(name => name !== "")
    .map(name => ({
      name,
      chips: startingChips,
      stars: 0,
      bonusStars: 0
    }));

  // Enforce minimum player count
  if (players.length < 3) {
    alert("You need at least 3 players.");
    return;
  }

  // Persist game state
  localStorage.setItem("mahjongPlayers", JSON.stringify(players));
  localStorage.setItem("chipValue", chipValue);
  localStorage.setItem("currentRound", 1);

  // Go to game
  window.location.href = "play.html";
}

