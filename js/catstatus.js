document.addEventListener("DOMContentLoaded", () => {
  const milkBtn = document.getElementById("giveMilkBtn");
  const petBtn = document.getElementById("givePetBtn");
  const walkBtn = document.getElementById("walkBtn");
  const milkImage = document.getElementById("milkImage");
  const milkCount = document.getElementById("milkCount");
  const petCount = document.getElementById("petCount");
  const moodMeter = document.getElementById("moodMeter");
  const moodLabel = document.getElementById("moodLabel");
  const coinDisplay = document.getElementById("coinCount");

  const today = new Date().toISOString().slice(0, 10);
  const now = Date.now();

  const meowSound = new Audio("../sounds/meow.mp3");
  const purrSound = new Audio("../sounds/purr.mp3");


  const catDialogue = document.getElementById("catDialogue");

  function updateCoinDisplay() {
    if (coinDisplay) {
      coinDisplay.textContent = Storage.getCoins();
    }
  }

  // Cat Name
const catStatus = Storage.getCatStatus() || { name: "Your Cat", mood: 50 };
const catNameDisplay = document.getElementById("catNameDisplay");
const editBtn = document.getElementById("editCatNameBtn");
const nameInputWrapper = document.getElementById("nameInputWrapper");
const catNameInput = document.getElementById("catNameInput");
const saveBtn = document.getElementById("saveCatNameBtn");

// Initial name display
if (catNameDisplay) {
  catNameDisplay.textContent = catStatus.name || "Your Cat";
}

// Open name editor
editBtn?.addEventListener("click", () => {
  if (nameInputWrapper && catNameInput) {
    nameInputWrapper.style.display = "block";
    catNameInput.value = catStatus.name || "";
    catNameInput.focus();
  }
});

// Save name
saveBtn?.addEventListener("click", () => {
  const newName = catNameInput?.value.trim();
  if (newName) {
    catStatus.name = newName;
    Storage.setCatStatus(catStatus);
    if (catNameDisplay) catNameDisplay.textContent = newName;
  }
  if (nameInputWrapper) nameInputWrapper.style.display = "none";
});


  function boostMood(amount) {
    catStatus.mood = Math.min(catStatus.mood + amount, 100);
    Storage.setCatStatus(catStatus);
    moodMeter.value = catStatus.mood;
    moodLabel.textContent = moodToLabel(catStatus.mood);
    updateCatImageBasedOnMood();
  }

  function moodToLabel(mood) {
    if (mood >= 80) return "Playful 😺";
    if (mood >= 50) return "Content 😊";
    if (mood >= 20) return "Neutral 😐";
    return "Sad 😿";
  }

  function updateMoodFromFood(itemName) {
    const sugary = ["Fruit Cake", "Scone", "Cinnamon Rolls", "Pancake", "Swiss Roll", "Macarons", "Strawberry Pudding", "My Melody Set"];
    const warm = ["English Breakfast", "Mushroom Soup", "Hot Cross Buns", "Ponyo Ramen"];
    const bonus = ["Lucky Ice Cream", "Rainbow Shake", "Mermaid Parfait", "Sakura Tea", "Jelly Sundae"];

    if (sugary.includes(itemName)) catStatus.mood += 5;
    if (warm.includes(itemName)) catStatus.mood += 10;
    if (bonus.includes(itemName)) catStatus.mood += 15;

    catStatus.mood = Math.min(catStatus.mood, 100);
    Storage.setCatStatus(catStatus);

    moodMeter.value = catStatus.mood;
    moodLabel.textContent = moodToLabel(catStatus.mood);
    updateCatImageBasedOnMood();
  }

  function updateCatImageBasedOnMood() {
    const catImg = document.getElementById("selectedCat");
    const chosenCat = Storage.getChosenCat();
    const baseName = chosenCat.replace(".png", "");
    const mood = catStatus.mood;

    let finalFile = "";
    if (mood >= 80) {
      finalFile = `../images/cats/playful_${baseName}.png`;
    } else if (mood >= 50) {
      finalFile = `../images/cats/${baseName}_sleep.png`;
    } else {
      finalFile = `../images/cats/${baseName}.png`;
    }

    if (catImg) {
      catImg.src = finalFile;
    }
  }

  function showCatDialogue(text) {
    if (!catDialogue) return;
    catDialogue.textContent = text;
    catDialogue.style.display = "block";
    setTimeout(() => {
      catDialogue.style.display = "none";
    }, 3000);
  }

  moodMeter.value = catStatus.mood;
  moodLabel.textContent = moodToLabel(catStatus.mood);
  updateCatImageBasedOnMood();
  updateCoinDisplay();

  const fedItems = JSON.parse(localStorage.getItem("recentlyFed") || "[]");
  fedItems.forEach(itemName => {
    if (typeof applyFoodEffect === "function") {
      applyFoodEffect(itemName);
    }
    updateMoodFromFood(itemName);
    showCatDialogue(`Yum! Thanks for the ${itemName}!`);
  });
  localStorage.removeItem("recentlyFed");

  petBtn?.addEventListener("click", () => {
    const petData = JSON.parse(localStorage.getItem("pets") || "{}");
    if (!petData[today]) petData[today] = { count: 0, lastReset: now };

    if (petData[today].count < 5) {
      petData[today].count += 1;
      localStorage.setItem("pets", JSON.stringify(petData));
      petCount.textContent = petData[today].count;

      purrSound.currentTime = 0;
      purrSound.play();
      boostMood(5);
      Storage.addCoins(5);
      updateCoinDisplay();
      showCatDialogue("Prrr~ Thank you!");
    } else {
      alert("🚫 You’ve already pet the cat 5 times today!");
    }
  });

  milkBtn?.addEventListener("click", () => {
    const milkData = JSON.parse(localStorage.getItem("milk") || "{}");
    if (!milkData[today]) milkData[today] = { count: 0, lastReset: now };

    if (milkData[today].count < 4) {
      milkData[today].count += 1;
      localStorage.setItem("milk", JSON.stringify(milkData));
      milkCount.textContent = milkData[today].count;

      milkImage.style.display = "block";
      setTimeout(() => milkImage.style.display = "none", 1500);

      meowSound.currentTime = 0;
      meowSound.play();
      boostMood(5);
      Storage.addCoins(5);
      updateCoinDisplay();
      showCatDialogue("Yay! Milk time!");
    } else {
      alert("🚫 Your cat already had enough milk today!");
    }
  });

  walkBtn?.addEventListener("click", () => {
    const walkData = JSON.parse(localStorage.getItem("walks") || "{}");
    if (!walkData[today]) walkData[today] = { count: 0, lastReset: now };

    if (walkData[today].count < 3) {
      walkData[today].count += 1;
      localStorage.setItem("walks", JSON.stringify(walkData));

      boostMood(10);
      Storage.addCoins(10);
      updateCoinDisplay();
      window.location.href = "walk.html";
    } else {
      alert("🚫 You’ve already walked your cat 3 times today!");
    }
  });

  function checkIfCatShouldSleep() {
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
    const chosenCat = Storage.getChosenCat();
    const baseName = chosenCat.replace(".png", "");
    const finalSleepImg = `../images/cats/${baseName}_sleep.png`;

    if (catImg) catImg.src = finalSleepImg;
    showCatDialogue("Zzz... your cat is peacefully sleeping 💖");


    function showCoinPopup(amount, targetElementId) {
  const target = document.getElementById(targetElementId);
  if (!target) return;

  const popup = document.createElement("div");
  popup.className = "coin-popup";
  popup.textContent = `+${amount} 🪙`;

  const rect = target.getBoundingClientRect();
  popup.style.left = `${rect.left + rect.width / 2}px`;
  popup.style.top = `${rect.top}px`;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1000);
}

    const starContainer = document.createElement("div");
    starContainer.className = "sleep-stars";
    document.body.appendChild(starContainer);

    for (let i = 0; i < 15; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      starContainer.appendChild(star);
    }


  }
}

checkIfCatShouldSleep(); 

});