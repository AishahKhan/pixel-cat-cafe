document.addEventListener("DOMContentLoaded", () => {
  const trayList = document.getElementById("tray-list");
  const trayTotal = document.getElementById("trayTotal");
  const clearBtn = document.getElementById("clearTray");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const receiptModal = document.getElementById("receiptModal");
  const receiptList = document.getElementById("receiptList");
  const receiptTotal = document.getElementById("receiptTotal");
  const closeReceipt = document.getElementById("closeReceipt");

  let tray = Storage.getTray() || [];

  function renderTray() {
    tray = Storage.getTray() || [];
    trayList.innerHTML = "";
    let total = 0;

    if (tray.length === 0) {
      trayList.innerHTML = "<li>Your tray is empty.</li>";
      trayTotal.textContent = "Total: 🪙 0 coins";
      return;
    }

    tray.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="tray-icon">
        <span>${item.name}</span>
        <span class="price">🪙 ${item.price}</span>
        <button class="remove-item" data-index="${index}">❌</button>
      `;
      trayList.appendChild(li);
      total += parseInt(item.price || 0);
    });

    trayTotal.textContent = `Total: 🪙 ${total}`;
  }

  trayList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const index = e.target.dataset.index;
      tray.splice(index, 1);
      Storage.setTray(tray);
      renderTray();
    }
  });

  clearBtn?.addEventListener("click", () => {
    tray = Storage.getTray() || [];
    if (tray.length === 0) {
      alert("Your tray is already empty!");
      return;
    }

    const confirmClear = confirm("Are you sure you want to clear your tray?");
    if (confirmClear) {
      tray = [];
      Storage.clearTray();
      renderTray();
    }
  });

checkoutBtn?.addEventListener("click", () => {
  tray = Storage.getTray() || [];
  const coins = Storage.getCoins();
  const total = tray.reduce((sum, item) => sum + parseInt(item.price || 0), 0);

  if (tray.length === 0) {
    alert("Your tray is empty!");
    return;
  }

  if (coins < total) {
    alert("Insufficient coins!");
    return;
  }

  Storage.setCoins(coins - total);
  if (typeof updateCoinDisplay === "function") updateCoinDisplay();

  const inventory = Storage.getInventory() || {};

  tray.forEach(item => {
    if (inventory[item.name]) {
      inventory[item.name].quantity += 1;
    } else {
      inventory[item.name] = {
        quantity: 1,
        image: item.image
      };
    }
  });

  Storage.setInventory(inventory);

  const checkoutSound = new Audio("../sounds/checkout.mp3");
  checkoutSound.play();

  showReceipt(tray, total);

  tray = [];
  Storage.clearTray();
  renderTray();
});


  function showReceipt(items, total) {
    receiptList.innerHTML = "";

    items.forEach(item => {
      const li = document.createElement("li");
      li.className = "receipt-item";
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="receipt-icon">
        <span class="receipt-name">${item.name}</span>
        <span class="receipt-price">🪙 ${item.price}</span>
      `;
      receiptList.appendChild(li);
    });

    receiptTotal.textContent = `Total: 🪙 ${total}`;
    receiptModal.style.display = "block";
  }

  closeReceipt?.addEventListener("click", () => {
    receiptModal.style.display = "none";
  });

  renderTray();

function checkIfCatShouldSleep() {
  const today = new Date().toISOString().slice(0, 10);
  const milkData = JSON.parse(localStorage.getItem("milk") || "{}");
  const petData = JSON.parse(localStorage.getItem("pets") || "{}");
  const walkData = JSON.parse(localStorage.getItem("walks") || "{}");

  const milkToday = milkData[today]?.count || 0;
  const petsToday = petData[today]?.count || 0;
  const walksToday = walkData[today]?.count || 0;

  const milkFull = milkToday >= 4;
  const petsFull = petsToday >= 5;
  const walksFull = walksToday >= 3;

  if (milkFull && petsFull && walksFull) {
    const catImg = document.getElementById("selectedCat");
    const chosenCat = localStorage.getItem("chosenCat") || "jiji.png";
    const baseName = chosenCat.replace(".png", "");
    const finalSleepImg = `../images/cats/${baseName}_sleep.png`;

    if (catImg) catImg.src = finalSleepImg;
    showCatDialogue("Zzz... your cat is peacefully sleeping 💖");

    triggerSleepingStars();
  }
}


function triggerSleepingStars() {
  for (let i = 0; i < 10; i++) {
    const star = document.createElement("div");
    star.className = "sleep-star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 60 + 20}px`;
    document.body.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 3000);
  }
}

checkIfCatShouldSleep();


});
