document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById('walkMusic');
  const pauseBtn = document.getElementById('pauseMusic');
  const toggleBtn = document.getElementById('themeToggle');
  const coinDisplay = document.getElementById('coinCount');
  const cat = document.getElementById('walking-cat');
  const walkTimer = document.getElementById('walkTimer');

  // 🧩 Load dropdown
  fetch('../views/dropdown.html')
    .then(res => res.text())
    .then(html => {
      const header = document.getElementById("common-header");
      if (header) header.innerHTML = html;

      const coinDisplay = document.getElementById("coinCount");
      if (coinDisplay) {
        coinDisplay.textContent = localStorage.getItem("coins") || "0";
      }
    });

  // 🎵 Music controls
  const wasPaused = localStorage.getItem("walkMusicPaused") === "true";
  const savedTime = parseFloat(localStorage.getItem("walkMusicTime") || "0");

  if (music) {
    music.currentTime = savedTime;

    if (!wasPaused) {
      music.play().catch(err => console.warn("Autoplay blocked:", err));
      if (pauseBtn) pauseBtn.textContent = "⏸ Pause Music";
    } else {
      music.pause();
      if (pauseBtn) pauseBtn.textContent = "▶ Play Music";
    }

    pauseBtn?.addEventListener("click", () => {
      if (music.paused) {
        music.play();
        pauseBtn.textContent = "⏸ Pause Music";
      } else {
        music.pause();
        pauseBtn.textContent = "▶ Play Music";
      }
    });

    window.addEventListener("beforeunload", () => {
      localStorage.setItem("walkMusicTime", music.currentTime);
      localStorage.setItem("walkMusicPaused", music.paused);
    });
  }

  // 🌙 Theme toggle
  let currentTheme = localStorage.getItem('walkTheme') || 'day';
  applyTheme(currentTheme);

  toggleBtn?.addEventListener('click', () => {
    currentTheme = currentTheme === 'day' ? 'night' : 'day';
    applyTheme(currentTheme);
    localStorage.setItem('walkTheme', currentTheme);
  });

  function applyTheme(theme) {
    const body = document.body;
    const source = music.querySelector('source');

    if (theme === 'night') {
      body.classList.remove('day-bg');
      body.classList.add('night-bg');
      toggleBtn.textContent = '🌞 Day';
      cat.style.top = '55%';
      if (source) source.src = '../sounds/walknight.mp3';
    } else {
      body.classList.remove('night-bg');
      body.classList.add('day-bg');
      toggleBtn.textContent = '🌙 Night';
      cat.style.top = '60%';
      if (source) source.src = '../sounds/walk.mp3';
    }

    music.load();
    if (!wasPaused) music.play().catch(() => {});
  }

  // 💰 Coin logic
  function addCoins(amount) {
    Storage.addCoins(amount);
    if (coinDisplay) coinDisplay.textContent = Storage.getCoins();
  }

  function showPopup(text) {
    const popup = document.createElement('div');
    popup.textContent = text;
    popup.style.position = 'absolute';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.fontSize = '24px';
    popup.style.color = '#ff99cc';
    popup.style.fontFamily = 'VT323, monospace';
    popup.style.zIndex = 100;
    popup.style.animation = 'fadeUp 1s ease-out';
    popup.style.pointerEvents = 'none';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }

  // 🦋 Butterfly rewards
  function spawnButterfly() {
    const butterfly = document.createElement('div');
    butterfly.classList.add('butterfly');
    butterfly.style.top = `${Math.random() * 60 + 20}%`;
    butterfly.style.left = `-40px`;

    butterfly.addEventListener('click', () => {
      butterfly.remove();
      addCoins(5);
      showPopup("+5 🦋");
    });

    document.body.appendChild(butterfly);
    setTimeout(() => butterfly.remove(), 6000);
  }

  const butterflyInterval = setInterval(spawnButterfly, 6000);
  spawnButterfly();

  // 🐾 Walk timer
  let walkStartTime = Date.now();
  let walkRewarded = false;
  let timeRemaining = 60;

  function checkWalkDuration() {
    const now = Date.now();
    const elapsed = now - walkStartTime;

    if (!walkRewarded && elapsed >= 60000) {
      walkRewarded = true;

      const today = new Date().toISOString().slice(0, 10);
      const walkData = JSON.parse(localStorage.getItem("walks") || "{}");
      const currentCount = walkData[today]?.count || 0;

      if (currentCount < 3) {
        walkData[today] = {
          count: currentCount + 1,
          lastReset: Date.now()
        };
        localStorage.setItem("walks", JSON.stringify(walkData));
        addCoins(10);
        showPopup("+10 🐾 Walk complete!");
      } else {
        showPopup("🚫 Max 3 walks today!");
      }

      if (walkTimer) walkTimer.textContent = `✅ Walk complete! Redirecting...`;
      clearInterval(butterflyInterval);
      setTimeout(() => window.location.href = "catstatus.html", 3000);
    }
  }

  function updateWalkTimer() {
    if (!walkTimer || walkRewarded) return;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    walkTimer.textContent = `⏳ Walk time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (timeRemaining > 0) timeRemaining--;
  }

  setInterval(checkWalkDuration, 1000);
  setInterval(updateWalkTimer, 1000);
});
