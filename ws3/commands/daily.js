const fs = require('fs');
const path = require('path');

module.exports = {
  name: "dailycoins",
  description: "Receive a random amount of coins (150 - 500) once per day.",
  async run({ api, event, send }) {
    const userId = event.sender.id;
    const now = new Date();

    // Define paths for daily and coin balance files
    const dailyDir = path.join(__dirname, '../database/daily');
    const dailyFile = path.join(dailyDir, `${userId}.json`);
    const coinBalanceDir = path.join(__dirname, '../database/coin_balances');
    const coinBalanceFile = path.join(coinBalanceDir, `${userId}.json`);

    // Ensure directories exist
    if (!fs.existsSync(dailyDir)) fs.mkdirSync(dailyDir, { recursive: true });
    if (!fs.existsSync(coinBalanceDir)) fs.mkdirSync(coinBalanceDir, { recursive: true });

    // Check if the user already claimed their daily reward
    if (fs.existsSync(dailyFile)) {
      const lastClaimed = new Date(JSON.parse(fs.readFileSync(dailyFile, 'utf8')).lastClaimed);
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (now - lastClaimed < oneDay) {
        const nextClaim = new Date(lastClaimed.getTime() + oneDay);
        const timeLeft = nextClaim - now;
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        return send(`You have already claimed your daily coins. Try again in ${hoursLeft} hours and ${minutesLeft} minutes.`);
      }
    }

    // Generate a random coin reward (150 - 500)
    const randomCoins = Math.floor(Math.random() * (500 - 150 + 1)) + 150;

    // Load the user's current coin balance
    let coinBalance = 0;
    if (fs.existsSync(coinBalanceFile)) {
      coinBalance = JSON.parse(fs.readFileSync(coinBalanceFile, 'utf8'));
    }
    coinBalance += randomCoins;

    // Save the updated balance and claim timestamp
    fs.writeFileSync(coinBalanceFile, JSON.stringify(coinBalance));
    fs.writeFileSync(dailyFile, JSON.stringify({ lastClaimed: now }));

    // Send the reward message
    return send(`You have received ${randomCoins} coins! You now have ${coinBalance} coins.`);
  },
};