document.addEventListener("DOMContentLoaded", () => {
  const inventoryContainer = document.getElementById("inventoryContainer");
  const coinDisplay = document.getElementById("coinCount");

  if (coinDisplay) {
    coinDisplay.textContent = Storage.getCoins();
  }

  function renderInventory() {
    const inventory = Storage.getInventory() || {}; 
    inventoryContainer.innerHTML = "";

    const itemNames = Object.keys(inventory);
    if (itemNames.length === 0) {
      inventoryContainer.innerHTML = "<p>Your inventory is empty.</p>";
      return;
    }

    itemNames.forEach(itemName => {
      const item = inventory[itemName];
      if (!item || !item.image || !itemName) return;

      const card = document.createElement("div");
      card.className = "inventory-item";
      card.innerHTML = `
        <img src="${item.image}" alt="${itemName}">
        <div>${itemName}</div>
        <div class="quantity-label">x${item.quantity}</div>
        <button class="feed-button">Feed</button>
      `;

      const feedBtn = card.querySelector(".feed-button");
      feedBtn.addEventListener("click", () => {
        if (item.quantity > 0) {
          item.quantity -= 1;

          const pendingFeed = JSON.parse(localStorage.getItem("recentlyFed") || "[]");
          pendingFeed.push(itemName);
          localStorage.setItem("recentlyFed", JSON.stringify(pendingFeed));

          if (item.quantity <= 0) {
            delete inventory[itemName];
          }

          Storage.setInventory(inventory);

          if (confirm(`🎉 You selected ${itemName}!\nGo check on your cat?`)) {
            window.location.href = "catstatus.html";
          } else {
            renderInventory(); 
          }
        }
      });

      inventoryContainer.appendChild(card);
    });
  }

  renderInventory();
});
