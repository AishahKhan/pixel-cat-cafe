function updateCoinDisplay() {
  const coinDisplay = document.querySelector("#coinCount");
  if (coinDisplay) {
    const coins = localStorage.getItem("coins") || "0";
    coinDisplay.textContent = coins;
  }
}


window.updateCoinDisplay = updateCoinDisplay;

