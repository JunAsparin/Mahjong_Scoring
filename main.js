const CHIP_VALUE = 0.25;
const playersDiv = document.getElementById('players');
let playerCount = 0;
function createPlayer() {
  playerCount++;
  const div = document.createElement('div');
  div.className = 'player';
  div.innerHTML = `
    <input type="text" placeholder="Player Name" />
    <input type="number" placeholder="Chips" value="0" oninput="updateMoney(this)" />
    <input type="text" placeholder="$0.00" disabled />
  `;
  playersDiv.appendChild(div);
}
function addPlayer() {
  if (playerCount >= 4) return alert('Maximum of 4 players');
  createPlayer();
}
function removePlayer() {
  if (playerCount <= 3) return alert('Minimum of 3 players');
  playersDiv.removeChild(playersDiv.lastElementChild);
  playerCount--;
}
function updateMoney(chipInput) {
  const playerRow = chipInput.parentElement;
  const moneyField = playerRow.children[2];
  const chips = parseFloat(chipInput.value) || 0;
  const money = chips * CHIP_VALUE;
  moneyField.value = `$${money.toFixed(2)}`;
}
// Initialize with 3 players
createPlayer();
createPlayer();
createPlayer();