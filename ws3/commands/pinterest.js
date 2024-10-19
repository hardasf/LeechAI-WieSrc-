const axios = require('axios');

module.exports = {
  name: "pinterest",
  description: "Sends Pinterest images based on your search",

  async run({ event, send, args }) {
    try {
      if (args.length === 0) {
        return await send(`Invalid format! Use the command like this:\n\npinterest [search term] - [number of images]\nExample: pinterest cat - 10`);
      }

      const [searchTerm, count] = args.join(" ").split(" - ");
      if (!searchTerm) {
        return await send(`Invalid format! Use the command like this:\n\npinterest [search term] - [number of images]\nExample: pinterest cat - 10`);
      }

      const numOfImages = parseInt(count) || 5;

      const response = await axios.get(`https://api.kenliejugarap.com/pinterestbymarjhun/?search=${encodeURIComponent(searchTerm)}`);
      
      if (!response.data.status) {
        return await send(`No results found for "${searchTerm}".`);
      }

      const imageUrls = response.data.data.slice(0, numOfImages);

      if (imageUrls.length === 0) {
        return await send(`No available images for "${searchTerm}".`);
      }

      for (const url of imageUrls) {
        await send({
          attachment: {
            type: "image",
            payload: {
              url: url
            }
          }
        });
      }
    } catch (error) {
      await send(`Failed to retrieve images from Pinterest. Error: ${error.message || error}`);
    }
  }
};
