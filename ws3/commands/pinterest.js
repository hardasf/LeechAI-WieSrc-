const axios = require("axios");
const name = "pinterest";

module.exports = {
  name,
  description: "Fetch and send Pinterest images based on your query.",
  async run({ api, event, send, args }) {
    const query = args.join(" ");
    if (!query) 
      return send(`Please enter a search query!

Example: ${api.prefix + name} nature`);

    send("Searching for Pinterest images... 🔎");

    try {
      const response = await axios.get(`https://deku-rest-apis.ooguy.com/api/pinterest`, {
        params: { q: query }
      });

      const { status, result } = response.data;

      if (status === 200 && result.length > 0) {
        const imagePromises = result.map(async (url) => {
          const { data: image } = await axios.get(url, { responseType: "arraybuffer" });
          const fileName = `/tmp/${url.split('/').pop()}`; // Create a temp filename
          require("fs").writeFileSync(fileName, Buffer.from(image, "binary")); // Save the image
          return require("fs").createReadStream(fileName); // Return the file stream
        });

        const attachments = await Promise.all(imagePromises);

        api.sendMessage(
          { body: "Here are your Pinterest images:", attachment: attachments },
          event.threadID
        );
      } else {
        throw new Error("No images found. Please try a different query.");
      }
    } catch (err) {
      send(`Error: ${err.message || err}`);
    }
  }
};