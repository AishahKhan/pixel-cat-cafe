document.addEventListener("DOMContentLoaded", () => {
  const petBtn = document.getElementById("givePetBtn");
  const coinCountSpan = document.getElementById("coinCount");

  const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
  const MAX_PETS = 5;
  const COIN_REWARD = 5;

  function updateCoinDisplay() {
    coinCountSpan.textContent = Storage.getCoins();
  }

  function getPetData() {
    return JSON.parse(localStorage.getItem("petData")) || {
      count: 0,
      lastReset: Date.now()
    };
  }

  function setPetData(data) {
    localStorage.setItem("petData", JSON.stringify(data));
  }

  function getTimeRemaining(endTime) {
    const now = Date.now();
    const diff = endTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function showPetCooldownAlert(resetTime) {
    const existing = document.getElementById("pet-alert");
    if (existing) existing.remove();

    const alertBox = document.createElement("div");
    alertBox.id = "pet-alert";
    alertBox.style.position = "fixed";
    alertBox.style.top = "60px";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translateX(-50%)";
    alertBox.style.padding = "12px 20px";
    alertBox.style.backgroundColor = "#eefff0";
    alertBox.style.border = "2px solid #65c986";
    alertBox.style.color = "#2c503f";
    alertBox.style.fontFamily = "'Segoe UI Emoji', 'Noto Color Emoji', 'Apple Color Emoji', 'VT323', monospace";
    alertBox.style.fontSize = "18px";
    alertBox.style.borderRadius = "8px";
    alertBox.style.zIndex = "9999";
    alertBox.style.textAlign = "center";

    let added = false;

    const interval = setInterval(() => {
      const remaining = resetTime - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        alertBox.remove();
        localStorage.removeItem("petData");
        return;
      }

      alertBox.textContent = `🐈 You can pet the cat again in ${getTimeRemaining(resetTime)}!`;

      if (!added) {
        document.body.appendChild(alertBox);
        added = true;
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      alertBox.remove();
    }, 5000);
  }

  function showCoinPopup(amount, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const popup = document.createElement("div");
    popup.className = "coin-popup";
    popup.textContent = `+${amount} 🪙`;

    const rect = target.getBoundingClientRect();
    popup.style.position = "fixed";
    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top = `${rect.top - 20}px`;

    document.body.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 1000);
  }

  if (petBtn && coinCountSpan) {
    updateCoinDisplay();

    let petData = getPetData();
    if (Date.now() - petData.lastReset >= COOLDOWN_MS) {
      petData = { count: 0, lastReset: Date.now() };
      setPetData(petData);
    }

    petBtn.addEventListener("click", () => {
      petData = getPetData();

      if (petData.count >= MAX_PETS) {
        showPetCooldownAlert(petData.lastReset + COOLDOWN_MS);
        return;
      }

      const purrSound = new Audio("sounds/purr.mp3");
      purrSound.play();

      Storage.addCoins(COIN_REWARD);
      showCoinPopup(COIN_REWARD, "givePetBtn");
      updateCoinDisplay();

      petData.count++;
      petData.lastReset = petData.lastReset || Date.now();
      setPetData(petData);
    });
  }
});
