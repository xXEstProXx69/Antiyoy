let gameState = null;
const DB = "https://tinkr.tech/sdb/Philipp_antiyoy/philipp_database";
const container = document.getElementById("game");

let selectedFrom = null;
let selectedTo = null;
let selectedFromEl = null;
let selectedToEl = null;
let selectedBuy = null;

function getMyColor() {
  const colors = ["red", "blue", "green", "yellow", "purple"];
  const myIndex = gameState.players.findIndex(p => p.username === localStorage.getItem("username"));
  return colors[myIndex];
}

function applyTurnColor() {
  const colors = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    purple: "#a855f7"
  };  
  const currentIndex = gameState.players.findIndex(p => p.username === gameState.current_player);
  const colorNames = ["red", "blue", "green", "yellow", "purple"];
  const color = colors[colorNames[currentIndex]];

  document.getElementById("turn-text").style.borderLeftColor = color;
  document.getElementById("Your-name").style.borderLeftColor = colors[getMyColor()];
}

async function buyUnit(type, hex) {
  const response = await fetch(DB, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "buy",
      player_key: localStorage.getItem("player_key"),
      type,
      hex: { col: hex.col, row: hex.row }
    })
  });
  const data = await response.json();
  console.log("Bought:", type, data);
}

async function GameData() {
  const response = await fetch(DB);
  const data = await response.json();

  if (data.phase === "lobby") {
    document.getElementById("shop-panel").style.display = "none";
    document.getElementById("lobby").style.display = "block";
    document.getElementById("game").style.display = "none";
    document.getElementById("end-turn").style.display = "none";
    document.getElementById("abortbtn").style.display = "none";
    document.getElementById("turn-text").style.display = "none";
    document.getElementById("Your-name").style.display = "none";
  } else {
    document.getElementById("shop-panel").style.display = "block";
    document.getElementById("lobby").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("end-turn").style.display = "block";
    document.getElementById("abortbtn").style.display = "block";
    document.getElementById("turn-text").style.display = "block";
    document.getElementById("Your-name").style.display = "block";
  }

  gameState = data;
  document.body.className = getMyColor();
  applyTurnColor();

  document.getElementById("turn-text").innerText = "Current turn: " + data.current_player;
  document.getElementById("Your-name").innerText = "Your name: " + localStorage.getItem("username");

  const GameMap = data.map;
  const player = data.players.find(p => p.username === localStorage.getItem("username"));

  if (!player) return;

  document.querySelector("#coin-counter").textContent = "🪙 " + player.money;
  document.querySelector("#income-counter").textContent = "📈 +" + (player.income - player.upkeep);

  const myFarms = data.map.filter(h => h.owner === localStorage.getItem("username") && h.building === "farm").length;
const farmPrice = 10 + (myFarms * 2);
document.querySelector(".buy-btn[data-type='farm'] .cost").textContent = farmPrice;

  container.innerHTML = "";
  selectedFrom = null;
  selectedTo = null;
  selectedFromEl = null;
  selectedToEl = null;

  for (const hex of GameMap) {
    if (hex.type === "impassable") continue;

    const img = document.createElement("img");
    img.src = "https://tinkr.tech" + hex.image;
    img.style.position = "absolute";
    img.style.left = hex.x + "px";
    img.style.top = hex.y + "px";
    img.style.width = hex.width + "px";
    img.style.height = hex.height + "px";

    img.addEventListener("click", () => {
      if (gameState.current_player !== localStorage.getItem("username")) {
        console.log("Not your turn!");
        return;
      }

      // BUY MODE
      if (selectedBuy) {
        buyUnit(selectedBuy, hex);
        selectedBuy = null;
        return;
      }

      // MOVE MODE
      if (!selectedFrom) {
        selectedFrom = hex;
        selectedFromEl = img;
        img.classList.add("selected-hex");
        console.log("FROM:", hex.col, hex.row);
      } else {
        selectedTo = hex;
        selectedToEl = img;
        img.classList.add("selected-hex");
        console.log("TO:", hex.col, hex.row);
        move();
        selectedFromEl.classList.remove("selected-hex");
        selectedToEl.classList.remove("selected-hex");
        selectedFrom = null;
        selectedTo = null;
        selectedFromEl = null;
        selectedToEl = null;
      }
    });

    container.appendChild(img);

    if (hex.building_image) {
      const building = document.createElement("img");
      building.src = "https://tinkr.tech" + hex.building_image;
      building.style.position = "absolute";
      building.style.left = hex.x + "px";
      building.style.top = hex.y + "px";
      building.style.width = hex.width + "px";
      building.style.height = hex.height + "px";
      building.style.pointerEvents = "none";
      container.appendChild(building);
    }

    if (hex.unit_image) {
      const unit = document.createElement("img");
      unit.src = "https://tinkr.tech" + hex.unit_image;
      unit.style.position = "absolute";
      unit.style.left = hex.x + "px";
      unit.style.top = hex.y + "px";
      unit.style.width = hex.width + "px";
      unit.style.height = hex.height + "px";
      unit.style.pointerEvents = "none"; 
      container.appendChild(unit);
    }
  }
}

// BUY BUTTONS
document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedBuy = btn.dataset.type;
    console.log("Buying:", selectedBuy);
  });
});

GameData();
setInterval(GameData, 1500);

// ADD PLAYER
async function AddPlayer() {
  const response = await fetch(DB, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "join",
      username: document.getElementById("username-input").value
    })
  });
  const data = await response.json();
  console.log(data);
  localStorage.setItem("player_key", data.player_key);
  localStorage.setItem("username", document.getElementById("username-input").value);
}

// END TURN
document.getElementById("end-turn").addEventListener("click", async () => {
  try {
    if (!gameState) return;
    if (gameState.current_player !== localStorage.getItem("username")) {
      console.log("Not your turn!");
      return;
    }
    const response = await fetch(DB, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "end_turn",
        player_key: localStorage.getItem("player_key")
      })
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error("Error:", err);
  }
});

// JOIN PLAYER
document.querySelector(".btn-primary").addEventListener("click", AddPlayer);

// MOVE UNIT
async function move() {
  if (!selectedFrom || !selectedTo) return;
  const response = await fetch(DB, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "move",
      player_key: localStorage.getItem("player_key"),
      from: { col: selectedFrom.col, row: selectedFrom.row },
      to: { col: selectedTo.col, row: selectedTo.row }
    })
  });
}

// START GAME
async function startGame() {
  const response = await fetch(DB, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "start" })
  });
  const data = await response.json();
  console.log(data);
}

document.querySelector(".btn-success").addEventListener("click", startGame);

// ABORT GAME
async function AbortGame() {
  const response = await fetch(DB, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "surrender",
      player_key: localStorage.getItem("player_key")
    })
  });
  const data = await response.json();
  console.log(data);
}

document.getElementById("abortbtn").addEventListener("click", AbortGame);