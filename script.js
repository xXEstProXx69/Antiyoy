const DB = "https://tinkr.tech/sdb/Philipp_antiyoy/philipp_database";
const container = document.getElementById("game");

async function GameData() {
  const response = await fetch(DB);
  const data = await response.json();

  console.log("Fetch found");

  const GameMap = data.map;
  console.log(GameMap);
}


GameData();

async function StartGame() {
    const server =  document.getElementById("server-url").value;
    const namespace = document.getElementById("db-namespace").value;
    const dbname = document.getElementById("db-name").value;

      const url = server + "/sdb/" + namespace + "/" + dbname;

       const response = await fetch(url, {
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


const allHexs = {
  red: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_red.svg",
  green: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_green.svg",
  blue: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_blue.svg",
  yellow: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_yellow.svg",
  purple: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_purple.svg",
  neutral: "https://tinkr.tech/sdb_apps/antiyoy/images/hex_neutral.svg"

}

const allUnits = {
    peasant: "https://tinkr.tech/sdb_apps/antiyoy/images/unit_peasant.svg",
    spearman: "https://tinkr.tech/sdb_apps/antiyoy/images/unit_spearman.svg",
    knight: "https://tinkr.tech/sdb_apps/antiyoy/images/unit_knight.svg",
    baron: "https://tinkr.tech/sdb_apps/antiyoy/images/unit_baron.svg"
}

const allBuildings = {
    farm: "https://tinkr.tech/sdb_apps/antiyoy/images/building_farm.svg",
    tower: "https://tinkr.tech/sdb_apps/antiyoy/images/building_tower.svg",
    fortress: "https://tinkr.tech/sdb_apps/antiyoy/images/building_fortress.svg"
}

const miscAssets = {
    tree: "https://tinkr.tech/sdb_apps/antiyoy/images/tree.svg",
    coin: "https://tinkr.tech/sdb_apps/antiyoy/images/coin.svg"
}
