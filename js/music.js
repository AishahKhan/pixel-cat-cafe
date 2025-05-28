document.addEventListener("DOMContentLoaded", () => {
  console.log("🎧 music.js loaded");

  window.addEventListener("beforeunload", () => {
    const music = document.getElementById("sharedMusic");
    if (music) {
      localStorage.setItem("musicTime", music.currentTime);
      localStorage.setItem("musicPaused", music.paused);
    }
  });

  const existing = document.getElementById("sharedMusic");
  if (!existing) {
    const audio = document.createElement("audio");
    audio.src = "../sounds/gamebg.mp3";
    audio.id = "sharedMusic";
    audio.loop = true;
    audio.volume = 0.5;
    document.body.appendChild(audio);

    const savedTime = parseFloat(localStorage.getItem("musicTime") || "0");
    const wasPaused = localStorage.getItem("musicPaused") === "true";

    audio.currentTime = savedTime;

    if (!wasPaused) {
      audio.play().then(() => {
        console.log("🎶 Music resumed from", savedTime);
      }).catch(err => {
        console.warn("🔇 Autoplay blocked:", err);
      });
    } else {
      console.log("⏸ Music loaded but paused");
    }

    document.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    }, { once: true });
  }

  fetch("../views/dropdown.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("common-header").innerHTML = html;

      setTimeout(() => {
        const pauseBtn = document.getElementById("pauseMusic");
        const music = document.getElementById("sharedMusic");

        if (pauseBtn && music) {
          pauseBtn.textContent = music.paused ? "▶ Play Music" : "⏸ Pause Music";

          pauseBtn.addEventListener("click", () => {
            if (music.paused) {
              music.play();
              pauseBtn.textContent = "⏸ Pause Music";
            } else {
              music.pause();
              pauseBtn.textContent = "▶ Play Music";
            }
          });
        }

        const coinDisplay = document.getElementById("coinCount");
        if (coinDisplay) {
          coinDisplay.textContent = localStorage.getItem("coins") || "0";
        }
      }, 150);
    });
});
