document.addEventListener("DOMContentLoaded", () => {
  const BONUS_AMOUNT = 15;
  const BONUS_KEY = "lastLogin";
  const BONUS_STREAK_KEY = "loginStreak";
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const lastLogin = localStorage.getItem(BONUS_KEY);
  const lastStreak = parseInt(localStorage.getItem(BONUS_STREAK_KEY) || "0");

function showBonus(amount, streak) {
  const container = document.createElement("div");
  container.classList.add("bonus-popup");

  container.innerHTML = `
    <div class="sparkle-container">✨</div>
    <strong>Daily Bonus!</strong><br>
    +${amount} coins<br>
    🔥 Streak: ${streak} day${streak === 1 ? "" : "s"}
  `;

  document.body.appendChild(container);


  const bonusSound = new Audio("../sounds/bonus.mp3");
  bonusSound.volume = 0.5; 
  bonusSound.play();

  setTimeout(() => {
    container.classList.add("hide-bonus");
  }, 4000);


  setTimeout(() => {
    container.remove();
  }, 5500);
}


  if (lastLogin !== today) {
    let newStreak = 1;
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yDate = yesterday.toISOString().slice(0, 10);

    if (lastLogin === yDate) {
      newStreak = lastStreak + 1;
    }

    const bonus = BONUS_AMOUNT + newStreak * 5;
    Storage.addCoins(bonus);
    Storage.setCoins(Storage.getCoins());
    localStorage.setItem(BONUS_KEY, today);
    localStorage.setItem(BONUS_STREAK_KEY, newStreak);
    showBonus(bonus, newStreak);
  }
});
