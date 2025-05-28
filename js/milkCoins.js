document.addEventListener("DOMContentLoaded", () => {
  const giveMilkBtn = document.getElementById("giveMilkBtn");
  const milkImage = document.getElementById("milkImage");
  const coinCountSpan = document.getElementById("coinCount");

  const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
  const MAX_GIVES = 4;
  const COIN_REWARD = 5;

  function updateCoinDisplay() {
    coinCountSpan.textContent = Storage.getCoins();
  }

  function getMilkData() {
    return JSON.parse(localStorage.getItem("milkData")) || {
      count: 0,
      lastReset: Date.now()
    };
  }

  function setMilkData(data) {
    localStorage.setItem("milkData", JSON.stringify(data));
  }

  function getTimeRemaining(endTime) {
    const now = Date.now();
    const diff = endTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function showCooldownAlert(resetTime) {
    const existing = document.getElementById("milk-alert");
    if (existing) existing.remove();

    const alertBox = document.createElement("div");
    alertBox.id = "milk-alert";
    alertBox.style.position = "fixed";
    alertBox.style.top = "20px";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translateX(-50%)";
    alertBox.style.padding = "12px 20px";
    alertBox.style.backgroundColor = "#ffeef0";
    alertBox.style.border = "2px solid #ff6a80";
    alertBox.style.color = "#3f1d2c";
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
        localStorage.removeItem("milkData");
        return;
      }

      alertBox.textContent = `🥛 You can give more milk in ${getTimeRemaining(resetTime)}!`;

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

  if (giveMilkBtn && milkImage && coinCountSpan) {
    updateCoinDisplay();

    let milkData = getMilkData();
    if (Date.now() - milkData.lastReset >= COOLDOWN_MS) {
      milkData = { count: 0, lastReset: Date.now() };
      setMilkData(milkData);
    }

    giveMilkBtn.addEventListener("click", () => {
      milkData = getMilkData();

      if (milkData.count >= MAX_GIVES) {
        showCooldownAlert(milkData.lastReset + COOLDOWN_MS);
        return;
      }

      milkImage.style.display = "block";
      setTimeout(() => milkImage.style.display = "none", 3000);

      const milkSound = new Audio("sounds/meow.mp3");
      milkSound.play();

      Storage.addCoins(COIN_REWARD);
      showCoinPopup(COIN_REWARD, "giveMilkBtn");
      updateCoinDisplay();

      milkData.count++;
      milkData.lastReset = milkData.lastReset || Date.now();
      setMilkData(milkData);
    });
  }
});
