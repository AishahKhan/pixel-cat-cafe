document.addEventListener("DOMContentLoaded", () => {
  const milkCount = document.getElementById("milkCount");
  const milkCooldown = document.getElementById("milkCooldown");
  const petCount = document.getElementById("petCount");
  const petCooldown = document.getElementById("petCooldown");
  const walkCountSpan = document.getElementById("walkCount");
  const walkCooldown = document.getElementById("walkCooldown");

  const now = Date.now();
  const COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const today = new Date().toISOString().slice(0, 10);

  function initDailyData(key, max, countSpan, cooldownEl) {
    let data = JSON.parse(localStorage.getItem(key)) || {};

    if (!data[today]) {
      data[today] = { count: 0, lastReset: now };
      localStorage.setItem(key, JSON.stringify(data));
    }

    if (countSpan) countSpan.textContent = data[today].count;

    if (now - data[today].lastReset >= COOLDOWN_MS) {
      data[today] = { count: 0, lastReset: now };
      localStorage.setItem(key, JSON.stringify(data));
      if (countSpan) countSpan.textContent = 0;
      if (cooldownEl) cooldownEl.textContent = "";
    } else if (data[today].count >= max && cooldownEl) {
      updateTimer(data[today].lastReset + COOLDOWN_MS, cooldownEl);
    }
  }

  initDailyData("milk", 4, milkCount, milkCooldown);
  initDailyData("pets", 5, petCount, petCooldown);
  initDailyData("walks", 3, walkCountSpan, walkCooldown);

  function updateTimer(endTime, element) {
    function update() {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        element.textContent = "";
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      element.textContent = `⏳ Cooldown: ${hours}h ${minutes}m ${seconds}s`;
    }

    update();
    setInterval(update, 1000);
  }
});
