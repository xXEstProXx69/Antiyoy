let gameState = null;
const DB = "https://tinkr.tech/sdb/Philipp_antiyoy/philipp_database";
const container = document.getElementById("game");

async function GameData() {
  const response = await fetch(DB);
  const data = await response.json();

  if (data.phase === "lobby") {
    document.getElementById("lobby").style.display = "block";
    document.getElementById("game").style.display = "none";
    document.getElementById("end-turn").style.display = "none";
    document.getElementById("abortbtn").style.display = "none";
    document.getElementById("turn-text").style.display = "none";
    document.getElementById("Your-name").style.display = "none";
  } else {
    document.getElementById("lobby").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("end-turn").style.display = "block";
    document.getElementById("abortbtn").style.display = "block";
    document.getElementById("turn-text").style.display = "block";
    document.getElementById("Your-name").style.display = "block";
  }

  gameState = data;
  document.getElementById("turn-text").innerText =
  "Current turn: " + data.current_player;

  document.getElementById("Your-name").innerText =
    "Your name: " + localStorage.getItem("username");

  const GameMap = data.map;

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
    if (hex.unit_image) {
  const unit = document.createElement("img");
  unit.src = "https://tinkr.tech" + hex.unit_image;

  unit.style.position = "absolute";
  unit.style.left = hex.x + "px";
  unit.style.top = hex.y + "px";
  unit.style.width = hex.width + "px";
  unit.style.height = hex.height + "px";

  unit.style.pointerEvents = "none"; // IMPORTANT

  container.appendChild(unit);
}
    console.log("updating...");
  }
}

GameData();
setInterval(GameData, 1000);
container.innerHTML = "";

let selectedFrom = null;
let selectedTo = null;
let selectedFromEl = null;
let selectedToEl = null;

async function AddPlayer() {
  const response = await fetch("https://tinkr.tech/sdb/Philipp_antiyoy/philipp_database", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "join",
      username: document.getElementById("username-input").value
    })
  });

  const data = await response.json();
  console.log(data);

  localStorage.setItem("player_key", data.player_key);

  localStorage.setItem(
    "username",
    document.getElementById("username-input").value
  );
}

// END TURN
const end_turn_btn = document.getElementById("end-turn");

end_turn_btn.addEventListener("click",async () => {
  try {
    if (!gameState) return;

    if (gameState.current_player !== localStorage.getItem("username")) {
      console.log("Not your turn!");
      return;
    }

    const response = await fetch(DB, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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


  // ADD PLAYER
const joinbtn = document.querySelector(".btn-primary");
joinbtn.addEventListener("click", AddPlayer);

async function move() {
  if (!selectedFrom || !selectedTo) return;

  const response = await fetch("https://tinkr.tech/sdb/Philipp_antiyoy/philipp_database", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
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
  const response = await fetch("https://tinkr.tech/sdb/Philipp_antiyoy/philipp_database", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "start"
    })
  });

  const data = await response.json();
  console.log(data);
}



const startbtn = document.querySelector(".btn-success");
startbtn.addEventListener("click", startGame);



// ABORT GAME

async function AbortGame() {
  const response = await fetch(DB, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "surrender",
      player_key: localStorage.getItem("player_key")
    })
  });

  const data = await response.json();
  console.log(data);
}

const abortbtn = document.getElementById("abortbtn");
abortbtn.addEventListener("click", AbortGame);

// ALL ASSETS/ UNITS/ BUILDINGS/ HEXS

const allHexs = {
  red: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_red.svg",
  green: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_green.svg",
  blue: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_blue.svg",
  yellow: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_yellow.svg",
  purple: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_purple.svg",
  neutral: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_neutral.svg"
};

const allUnits = {
  peasant: "https://tinkr.tech/sdb_apps/antiyoy/images/unit_peasant.svg",
  spearman: "https://tinkr.tech/sdb_apps/antiyoy/images/unit_spearman.svg",
  knight: "https://tinkr.tech/sdb_apps/antiyoy/images/unit_knight.svg",
  baron: "https://tinkr.tech/sdb_apps/antiyoy/images/unit_baron.svg"
};

const allBuildings = {
  farm: "https://tinkr.tech/sdb_apps/antiyoy/images/building_farm.svg",
  tower: "https://tinkr.tech/sdb_apps/antiyoy/images/building_tower.svg",
  fortress: "https://tinkr.tech/sdb_apps/antiyoy/images/building_fortress.svg"
};

const miscAssets = {
  tree: "https://tinkr.tech/sdb_apps/antiyoy/images/tree.svg",
  coin: "https://tinkr.tech/sdb_apps/antiyoy/images/coin.svg"
};