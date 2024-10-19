const axios = require("axios");

const name = "rps"; // Command name (rock-paper-scissors)
const choices = ["bato", "gunting", "papel"]; // AI's possible choices

module.exports = {
  name,
  description: "Play rock-paper-scissors with AI!",
  async run({ api, event, send, args }) {
    const userChoice = args[0]?.toLowerCase(); // Get user's input
    if (!choices.includes(userChoice)) {
      return send(`Please choose between: bato, gunting, or papel! 

Example: ${api.prefix + name} gunting`);
    }

    send("AI is choosing... 🎮");

    // AI's random choice
    const aiChoice = choices[Math.floor(Math.random() * choices.length)];
    let result;

    // Determine the game result
    if (userChoice === aiChoice) {
      result = "It's a tie! 🤝";
    } else if (
      (userChoice === "bato" && aiChoice === "gunting") ||
      (userChoice === "gunting" && aiChoice === "papel") ||
      (userChoice === "papel" && aiChoice === "bato")
    ) {
      result = `You win! 🎉 AI chose ${aiChoice}.`;
    } else {
      result = `You lose! 😢 AI chose ${aiChoice}.`;
    }

    // Send the result
    send(`${result}

💌 https://www.facebook.com/imyourbaby.zxc000hhh`);
  }
};
