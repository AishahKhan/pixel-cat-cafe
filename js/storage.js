

const Storage = {
  // COINS
  getCoins: () => parseInt(localStorage.getItem("coins") || "0"),
  setCoins: (amount) => localStorage.setItem("coins", amount),
  addCoins: (amount) => {
    const current = Storage.getCoins();
    Storage.setCoins(current + amount);
  },


  getTray: () => JSON.parse(localStorage.getItem("tray") || "[]"),
  setTray: (trayArray) => localStorage.setItem("tray", JSON.stringify(trayArray)),
  clearTray: () => localStorage.removeItem("tray"),



getInventory: () => JSON.parse(localStorage.getItem("inventory") || "{}"),
setInventory: (inventoryObject) => localStorage.setItem("inventory", JSON.stringify(inventoryObject)),



getCatStatus: () => {
  const defaultStatus = {
    mood: 50,
    milk: 0,
    pets: 0,
    walks: 0,
    name: "Your Cat"
  };
  try {
    const saved = JSON.parse(localStorage.getItem("catStatus"));
    return { ...defaultStatus, ...saved };
  } catch (e) {
    return defaultStatus;
  }
},

  setCatStatus: (status) => localStorage.setItem("catStatus", JSON.stringify(status)),


  getChosenCat: () => localStorage.getItem("chosenCat") || "jiji.png",
  setChosenCat: (catFile) => localStorage.setItem("chosenCat", catFile),


  resetAll: () => localStorage.clear()
};
