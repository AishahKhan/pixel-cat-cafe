const { ipcRenderer } = require('electron'); const dailySpecials = [
  { name: "Hot Cross Buns", image: "../images/specials/hotcrossbuns.png" },
  { name: "Lucky Ice Cream", image: "../images/specials/luckyicecream.gif" },
  { name: "Mushroom Soup", image: "../images/specials/mushroomsoup.png" },
  { name: "Rainbow Shake", image: "../images/specials/rainbowshake.png" },
  { name: "Mermaid Parfait", image: "../images/specials/mermaidparfait.png" },
  { name: "Jelly Sundae", image: "../images/specials/jellysundae.png" },
  { name: "My Melody Set", image: "../images/specials/mymelodyset.png" },
  { name: "Ponyo Ramen", image: "../images/specials/ponyoramen.png" },
  { name: "Sakura Tea", image: "../images/specials/sakuratea.gif" },
  { name: "Strawberry Pudding", image: "../images/specials/strawberrypudding.png" }
];

function getDailySpecials(count = 3) {
  const specials = [...dailySpecials];
  specials.sort(() => Math.random() - 0.5);
  return specials.slice(0, count);
}

const effectMap = {
  "Fruit Cake": "triggerZoomies",
  "Scone": "triggerZoomies",
  "Cinnamon Rolls": "triggerZoomies",
  "Pancake": "triggerZoomies",
  "Swiss Roll": "triggerZoomies",
  "Macarons": "triggerZoomies",
  "Strawberry Pudding": "triggerZoomies",
  "My Melody Set": "triggerCuteMode",
  "Peach Soda": "triggerChill",
  "Hot Chocolate": "triggerChill",
  "Tea": "triggerChill",
  "Mocha": "triggerChill",
  "Matcha Latte": "triggerChill",
  "Coffee Frappe": "triggerChill",
  "Melon Soda": "triggerChill",
  "Sakura Tea": "triggerPetalFall",
  "English Breakfast": "triggerSleepy",
  "Mushroom Soup": "triggerSleepy",
  "Hot Cross Buns": "triggerSleepy",
  "Ponyo Ramen": "triggerSleepy",
  "Parfait": "triggerChill",
  "Lucky Ice Cream": "triggerGoldSparkle",
  "Rainbow Shake": "triggerRainbow",
  "Mermaid Parfait": "triggerFloat",
  "Jelly Sundae": "triggerJellyBounce"
};

function applyFoodEffect(itemName) {
  const funcName = effectMap[itemName];
  if (funcName && typeof window[funcName] === "function") {
    window[funcName]();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popupText");
  const popupImage = document.getElementById("popupImage");
  const closeBtn = document.getElementById("closeBtn");
  const giveMilkBtn = document.getElementById("giveMilkBtn");
  const milkImage = document.getElementById("milkImage");
  const givePetBtn = document.getElementById("givePetBtn");
  const menuGrid = document.querySelector(".menu");
  const music = document.getElementById("bgMusic");
  const pauseBtn = document.getElementById("pauseMusic");
  const startBtn = document.getElementById("startBtn");
  const weatherOverlay = document.getElementById("weather-overlay");
  const weatherButtons = document.querySelectorAll("#weather-toggle button");
  const jiji = document.getElementById("jiji-cat");
  const jijiSleep = document.getElementById("jiji-sleep");


  if (menuGrid) {
    const specials = getDailySpecials(3);
    specials.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("item", "special-item");
      div.innerHTML = `
  <img src="${item.image}" alt="${item.name}">
  <p class="serve-trigger" data-item="${item.name}" data-img="${item.image}" data-price="50">
    ⭐ ${item.name}
  </p>
  <span class="price-tag">🪙 50 coins</span>
`;

      menuGrid.prepend(div);
    });


    menuGrid.addEventListener("click", (e) => {
      const trigger = e.target.closest(".serve-trigger");
      if (!trigger) return;

      const itemName = trigger.dataset.item;
      const itemImage = trigger.dataset.img;

      popupText.textContent = `${itemName.toLowerCase()} added to tray!`;
      popupImage.src = itemImage;
      popup.style.display = "flex";

      const clickSound = new Audio("click.wav");
      clickSound.play();

      const tray = Storage.getTray();
      const itemPrice = parseInt(trigger.dataset.price);
      tray.push({ name: itemName, image: itemImage, price: itemPrice });

      Storage.setTray(tray);

    });
  }

  if (giveMilkBtn && milkImage) {
    giveMilkBtn.addEventListener("click", () => {
      milkImage.style.display = "block";
      const milkSound = new Audio("../sounds/meow.mp3");
      milkSound.play();
      setTimeout(() => {
        milkImage.style.display = "none";
      }, 4000);
    });
  }

  if (givePetBtn) {
    givePetBtn.addEventListener("click", () => {
      const purrSound = new Audio("../sounds/purr.mp3");
      purrSound.play();
    });
  }

  let idleTimer;
  let selectedCat = localStorage.getItem("chosenCat") || "jiji.png";

  if (selectedCat.endsWith(".png.png")) {
    selectedCat = selectedCat.replace(".png.png", ".png");
  }

  const catName = selectedCat.replace(".png", "");
  const selectedSleepCat = `${catName}_sleep.png`;

  if (jiji && jijiSleep) {
    jiji.src = `../images/cats/${selectedCat}`;
    jijiSleep.src = `../images/cats/${selectedSleepCat}`;
    jiji.style.left = "0px";
    jiji.style.top = `${window.innerHeight - 100}px`;
    jijiSleep.style.left = jiji.style.left;
    jijiSleep.style.top = jiji.style.top;

    let targetX = 0;
    let targetY = 0;

    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX - 40;
      targetY = e.clientY - 40;

      jiji.style.display = "block";
      jijiSleep.style.display = "none";

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        jiji.style.display = "none";
        jijiSleep.style.display = "block";
      }, 10000);
    });

    function followMouse() {
      const currentX = parseFloat(jiji.style.left || 0);
      const currentY = parseFloat(jiji.style.top || window.innerHeight - 100);
      const newX = currentX + (targetX - currentX) * 0.05;
      const newY = currentY + (targetY - currentY) * 0.05;

      jiji.style.left = `${newX}px`;
      jiji.style.top = `${newY}px`;
      jijiSleep.style.left = `${newX}px`;
      jijiSleep.style.top = `${newY}px`;

      requestAnimationFrame(followMouse);
    }

    followMouse();

    setInterval(() => {
      const paw = document.createElement("img");
      paw.src = "../images/paw.png";
      paw.className = "paw-print";
      paw.style.left = `${jiji.offsetLeft + 20}px`;
      paw.style.top = `${jiji.offsetTop + 40}px`;
      document.body.appendChild(paw);

      setTimeout(() => paw.style.opacity = "0", 100);
      setTimeout(() => paw.remove(), 1600);
    }, 1000);
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      ipcRenderer.send("go-to-menu");
    });
  }

  weatherButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selected = button.dataset.weather;
      weatherOverlay.className = "weather " + selected;
    });
  });


  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      popup.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === popup) popup.style.display = "none";
  });
});
