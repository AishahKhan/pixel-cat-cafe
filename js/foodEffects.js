// ==== Food Effects ====

// 🌀 Hyper Zoomies
function triggerZoomies() {
  const cat = document.getElementById("selectedCat");
  if (!cat) return;

  let direction = 1;
  let count = 0;

  const zoom = setInterval(() => {
    cat.style.transition = "transform 0.3s ease-in-out";
    cat.style.transform = `translateX(${direction * 300}px) scaleX(${direction})`;
    direction *= -1;
    count++;
    if (count >= 12) {
      clearInterval(zoom);
      cat.style.transform = "translateX(0)";
    }
  }, 200);
}

// 😴 Sleepy Mode
function triggerSleepy() {
  const cat = document.getElementById("selectedCat");
  if (!cat) return;

  cat.style.opacity = "0.7";
  cat.style.filter = "blur(1px)";
  setTimeout(() => {
    cat.style.opacity = "1";
    cat.style.filter = "none";
  }, 6000);
}

// ☕ Chill Mode
function triggerChill() {
  const cat = document.getElementById("selectedCat");
  if (!cat) return;

  cat.style.transition = "opacity 0.5s";
  cat.style.opacity = "0.5";
  setTimeout(() => cat.style.opacity = "1", 6000);
}

// 🌈 Rainbow Mode
function triggerRainbow() {
  const cat = document.getElementById("selectedCat");
  const aura = document.getElementById("aura");
  const wrapper = document.getElementById("catWrapper");

  if (!cat || !aura || !wrapper) return;

  aura.style.display = "block";

  // Add sparkles every 300ms
  const sparkleInterval = setInterval(() => {
    const sparkle = document.createElement("div");
    sparkle.textContent = "✨";
    sparkle.className = "rainbow-sparkle";

    const rect = cat.getBoundingClientRect();
    sparkle.style.left = `${rect.left + Math.random() * rect.width}px`;
    sparkle.style.top = `${rect.top + Math.random() * rect.height}px`;

    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.style.transform = "translateY(-60px)";
      sparkle.style.opacity = "0";
    }, 50);

    setTimeout(() => sparkle.remove(), 2000);
  }, 300);


  setTimeout(() => {
    clearInterval(sparkleInterval);
    aura.style.display = "none";
  }, 8000);
}


function triggerFloat() {
  const cat = document.getElementById("selectedCat");
  if (!cat) return;

  let startTime = null;
  const amplitudeY = 10;     
  const amplitudeX = 20;     
  const frequency = 0.0015; 
  const duration = 10000;    

  cat.style.position = "relative";

  function floatStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const angle = elapsed * frequency;
    const vertical = Math.sin(angle * 2) * amplitudeY;
    const horizontal = Math.sin(angle) * amplitudeX;

    cat.style.top = `${vertical}px`;
    cat.style.left = `${horizontal}px`;

    if (elapsed < duration) {
      requestAnimationFrame(floatStep);
    } else {
      cat.style.top = "0px";
      cat.style.left = "0px";
    }
  }

  requestAnimationFrame(floatStep);
}





function triggerPetalFall() {
  for (let i = 0; i < 20; i++) {
    const petal = document.createElement("div");
    petal.textContent = "🌸";
    petal.style.position = "fixed";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = "-30px";
    petal.style.fontSize = "24px";
    petal.style.zIndex = "1000";
    document.body.appendChild(petal);

    const fall = setInterval(() => {
      petal.style.top = `${parseFloat(petal.style.top) + 1.5}px`;
      if (parseFloat(petal.style.top) > window.innerHeight) {
        clearInterval(fall);
        petal.remove();
      }
    }, 40);
  }
}

// 💖 Cute Mode (My Melody Set)
function triggerCuteMode() {
  const cat = document.getElementById("selectedCat");
  if (!cat) return;

  const rect = cat.getBoundingClientRect();

  cat.style.filter = "brightness(1.3)";
  cat.style.transition = "transform 0.3s ease";
  cat.style.transform = "scale(1.2)";

  const heart = document.createElement("div");
  heart.textContent = "💖";
  heart.style.position = "fixed";
  heart.style.left = `${rect.left + rect.width / 2}px`;
  heart.style.top = `${rect.top + rect.height / 2}px`;
  heart.style.transform = "translate(-50%, -50%) scale(2)";
  heart.style.fontSize = "36px";
  heart.style.zIndex = 999;
  heart.style.opacity = "1";
  heart.style.transition = "opacity 2s ease";
  document.body.appendChild(heart);

  const heartInterval = setInterval(() => {
    const floaty = document.createElement("div");
    floaty.textContent = "💖";
    floaty.style.position = "fixed";
    floaty.style.left = `${rect.left + Math.random() * rect.width}px`;
    floaty.style.top = `${rect.top + Math.random() * rect.height}px`;
    floaty.style.fontSize = "24px";
    floaty.style.zIndex = 999;
    floaty.style.opacity = "1";
    floaty.style.transition = "transform 3s, opacity 3s";
    document.body.appendChild(floaty);

    setTimeout(() => {
      floaty.style.transform = "translateY(-60px)";
      floaty.style.opacity = "0";
    }, 50);
    setTimeout(() => floaty.remove(), 3000);
  }, 500);

  setTimeout(() => {
    heart.style.opacity = "0";
    cat.style.transform = "scale(1)";
    cat.style.filter = "none";
    clearInterval(heartInterval);
    setTimeout(() => heart.remove(), 2000);
  }, 8000);
}

// 🍀 Lucky Sparkle
function triggerGoldSparkle() {
  const cat = document.getElementById("selectedCat");
  if (!cat) return;

  const rect = cat.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // ✨ Sparkles radiating around the cat
  for (let i = 0; i < 30; i++) {
    const sparkle = document.createElement("div");
    sparkle.textContent = "✨";
    sparkle.style.position = "fixed";
    sparkle.style.left = `${centerX}px`;
    sparkle.style.top = `${centerY}px`;
    sparkle.style.fontSize = `${16 + Math.random() * 10}px`;
    sparkle.style.color = "#FFD700";
    sparkle.style.zIndex = "9999";
    sparkle.style.opacity = "1";
    sparkle.style.pointerEvents = "none";
    sparkle.style.transition = "transform 2s ease, opacity 2s ease";

    document.body.appendChild(sparkle);

    const angle = Math.random() * 2 * Math.PI;
    const distance = 100 + Math.random() * 50;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    setTimeout(() => {
      sparkle.style.transform = `translate(${dx}px, ${dy}px)`;
      sparkle.style.opacity = "0";
    }, 50);

    setTimeout(() => sparkle.remove(), 2000);
  }

  // 🪙 Coin rain from top
  for (let i = 0; i < 30; i++) {
    const coin = document.createElement("div");
    coin.textContent = "🪙";
    coin.style.position = "fixed";
    coin.style.left = `${Math.random() * window.innerWidth}px`;
    coin.style.top = "-30px";
    coin.style.fontSize = "24px";
    coin.style.zIndex = "9999";
    coin.style.opacity = "1";
    coin.style.pointerEvents = "none";
    coin.style.transition = "transform 3s ease-in, opacity 3s ease-in";

    document.body.appendChild(coin);

    const fallY = window.innerHeight + 60;
    const rotate = Math.random() * 360;

    setTimeout(() => {
      coin.style.transform = `translateY(${fallY}px) rotate(${rotate}deg)`;
      coin.style.opacity = "0";
    }, 100);

    setTimeout(() => coin.remove(), 3100);
  }
}


// 🍮 Jelly Bounce
function triggerJellyBounce() {
  const cat = document.getElementById("selectedCat");
  if (!cat) return;

  cat.style.animation = "jellyBounce 1s ease-in-out 5";
}

// === Map food names to their effects ===
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
    console.log(`🍽️ Applying effect: ${funcName}`);
    window[funcName]();
  } else {
    console.warn(`⚠️ No effect found for item: ${itemName}`);
  }
}
