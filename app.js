//I added more detail to the game by adding more parameters like toolEfficiencies & marketFluctuation.
// I also added variables like price changes, rest, and weather. This effects your income. 
// Also in order to twin the game, you have to have a team and earn a certain amount.

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let money = 0;
let energy = 100; // Player starts with full energy
let tool = 'teeth';
const toolPrices = {
  scissors: 5,
  pushLawnmower: 25,
  batteryLawnmower: 250,
  team: 500
};
const toolEfficiencies = {
  teeth: 10,
  scissors: 200,
  pushLawnmower: 500,
  batteryLawnmower: 1000,
  team: 2500
};
const marketFluctuation = {
  scissors: [-2, 2],
  pushLawnmower: [-5, 5],
  batteryLawnmower: [-10, 10],
  team: [-20, 20]
};

function cutGrass() {
  const earnings = toolEfficiencies[tool];
  money += earnings;
  energy -= 5; // Cutting grass consumes energy
  console.log(`You earned $${earnings} cutting grass.`);
}

function buyTool(newTool) {
  const price = toolPrices[newTool];
  if (money >= price && tool !== newTool) {
    money -= price;
    tool = newTool;
    console.log(`You bought ${newTool} for $${price}.`);
  } else {
    console.log("You can't buy this tool right now.");
  }
}

function checkWin() {
  if (money >= 1000 && tool === 'team') {
    console.log("Congratulations! You've won the game.");
    rl.close();
    return true;
  }
  return false;
}

function simulateRainyDay() {
  const chanceOfRain = Math.random();
  if (chanceOfRain < 0.3) { // 30% chance of rain
    const earningsLost = Math.floor(money * (Math.random() * 0.2)); // Randomly lose up to 20% of earnings
    money -= earningsLost;
    console.log(`It rained today. You lost $${earningsLost}.`);
  }
}

function simulateMarketFluctuation() {
  for (let tool in toolPrices) {
    const [minChange, maxChange] = marketFluctuation[tool];
    const priceChange = Math.floor(Math.random() * (maxChange - minChange + 1)) + minChange;
    toolPrices[tool] += priceChange;
    console.log(`Price of ${tool} changed by ${priceChange}. New price: $${toolPrices[tool]}`);
  }
}

function mainLoop() {
  if (checkWin()) {
    return;
  }

  console.log(`Current tool: ${tool}, Money: $${money}, Energy: ${energy}`);
  simulateRainyDay();
  simulateMarketFluctuation();

  rl.question("What would you like to do? (cut/buy/hire/rest): ", (action) => {
    action = action.trim().toLowerCase();
    switch (action) {
      case 'cut':
        if (energy > 0) {
          cutGrass();
        } else {
          console.log("You don't have enough energy to work. Rest to regain energy.");
        }
        mainLoop();
        break;
      case 'buy':
        rl.question("Which tool would you like to buy? (scissors/pushLawnmower/batteryLawnmower/team): ", (newTool) => {
          buyTool(newTool.trim().toLowerCase());
          mainLoop();
        });
        break;
      case 'hire':
        buyTool('team');
        mainLoop();
        break;
      case 'rest':
        energy = Math.min(100, energy + 20); // Resting replenishes energy by 20 points
        console.log("You rested and regained some energy.");
        mainLoop();
        break;
      default:
        console.log("Invalid action. Please choose cut, buy, hire, or rest.");
        mainLoop();
    }
  });
}

mainLoop();
