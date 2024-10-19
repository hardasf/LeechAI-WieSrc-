const colors = [
  '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🌟', '👑', '💎'
];

function generatePattern() {
  return Array.from({ length: 4 }, () =>
    Array.from({ length: 5 }, () =>
      colors[Math.floor(Math.random() * colors.length)]
    )
  );
}

function calculateWinnings(pattern) {
  const flatPattern = pattern.flat();
  const starCount = flatPattern.filter(color => color === '🌟').length;

  if (starCount >= 5) return { winnings: 'Double Win!', freeSpins: 3 };

  const colorCounts = flatPattern.reduce((acc, color) => {
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {});

  const wildCardCount = colorCounts['👑'] || 0;

  for (const color in colorCounts) {
    if (color !== '👑' && colorCounts[color] + wildCardCount >= 6) {
      return { winnings: 'Standard Win!', freeSpins: 0 };
    }
  }

  return { winnings: 'No Win', freeSpins: 0 };
}

module.exports = {
  name: "scatter",
  description: "Play a scatter game with no coin betting.",
  async run({ send }) {
    const pattern = generatePattern();
    const { winnings, freeSpins } = calculateWinnings(pattern);

    let patternMessage = 'Here is the scatter pattern:\n';
    pattern.forEach(row => {
      patternMessage += row.join(' ') + '\n';
    });

    await send(`${patternMessage}\nResult: ${winnings}`);

    if (freeSpins > 0) {
      await send('Wow! You got Scatter! Conducting 3 free spins...');

      for (let i = 1; i <= freeSpins; i++) {
        const freeSpinPattern = generatePattern();
        const freeSpinResult = calculateWinnings(freeSpinPattern);

        let freeSpinMessage = `Free Spin ${i} pattern:\n`;
        freeSpinPattern.forEach(row => {
          freeSpinMessage += row.join(' ') + '\n';
        });

        await send(`${freeSpinMessage}\nResult: ${freeSpinResult.winnings}`);
      }
    }
  },
};
