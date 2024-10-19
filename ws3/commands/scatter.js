const fs = require('fs');
const path = require('path');

const colors = [
  '🔴', '🟠', '🟡', '🟢',
  '🔵', '🟣', '🟤', '⚫',
  '⚪', '🌟', '👑', '💎'
];

const MIN_BET = 50;
const MAX_BET = 1000000000;

function generatePattern() {
  let pattern = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 5; j++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      row.push(randomColor);
    }
    pattern.push(row);
  }
  return pattern;
}

function calculateWinnings(pattern, betAmount) {
  const flatPattern = pattern.flat();
  const starCount = flatPattern.filter(color => color === '🌟').length;

  if (starCount >= 5) return { winnings: betAmount * 4, freeSpins: 3 };

  const colorCounts = flatPattern.reduce((acc, color) => {
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {});

  const wildCardCount = colorCounts['👑'] || 0;

  for (let color in colorCounts) {
    if (color !== '👑' && colorCounts[color] + wildCardCount >= 6) {
      return { winnings: betAmount * 2, freeSpins: 0 };
    }
  }

  return { winnings: -betAmount, freeSpins: 0 };
}

module.exports = {
  name: 'scatter',
  description: 'Play a scatter game by betting coins.',
  async run({ api, event, send, args }) {
    const userId = event.sender.id;
    const coinBalanceFile = path.join(__dirname, `../database/coin_balances/${userId}.json`);
    const betAmount = parseInt(args[0]);

    if (isNaN(betAmount) || betAmount < MIN_BET || betAmount > MAX_BET) {
      return send(`Please enter a valid bet amount between ${MIN_BET} and ${MAX_BET}.`);
    }

    let coinBalance = 0;
    if (fs.existsSync(coinBalanceFile)) {
      coinBalance = JSON.parse(fs.readFileSync(coinBalanceFile, 'utf8'));
    }

    if (coinBalance < betAmount) {
      return send(`You don't have enough coins to bet ${betAmount}.`);
    }

    const pattern = generatePattern();
    let { winnings, freeSpins } = calculateWinnings(pattern, betAmount);

    coinBalance += winnings;
    fs.writeFileSync(coinBalanceFile, JSON.stringify(coinBalance));

    let patternMessage = 'Here is the scatter pattern:\n';
    pattern.forEach(row => {
      patternMessage += row.join(' ') + '\n';
    });

    const resultMessage = winnings > 0
      ? `Congratulations! You won ${winnings} coins!`
      : `Sorry, you lost ${-winnings} coins.`;

    await send(`${patternMessage}\n${resultMessage}\nYou now have ${coinBalance} coins.`);

    if (freeSpins > 0) {
      await send('Wow! You got Scatter! Conducting 3 free spins...');

      let totalFreeSpinWinnings = 0;

      for (let i = 1; i <= freeSpins; i++) {
        const freeSpinPattern = generatePattern();
        const freeSpinResults = calculateWinnings(freeSpinPattern, betAmount);
        totalFreeSpinWinnings += Math.max(0, freeSpinResults.winnings);

        let freeSpinMessage = `Free Spin ${i} pattern:\n`;
        freeSpinPattern.forEach(row => {
          freeSpinMessage += row.join(' ') + '\n';
        });

        await send(freeSpinMessage);
      }

      coinBalance += totalFreeSpinWinnings;
      fs.writeFileSync(coinBalanceFile, JSON.stringify(coinBalance));

      await send(`Total winnings from free spins: ${totalFreeSpinWinnings} coins!\nYou now have ${coinBalance} coins.`);
    }
  },
};