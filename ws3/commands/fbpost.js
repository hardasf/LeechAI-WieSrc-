const axios = require('axios');

module.exports = {
  name: "fbpost",
  description: "Generate a Facebook-like post image.",
  async run({ event, send, args }) {
    try {
      // Check if all required arguments are provided
      if (args.length < 3) {
        return send('Usage: fbpost <uid>/<text>/<name>');
      }

      // Extract the arguments from input
      const [uid, ...postParts] = args;
      const name = postParts.pop(); // Last part as the name
      const text = postParts.join(' '); // Remaining parts as the post content

      // Build the API URL with the extracted arguments
      const apiUrl = `https://joshweb.click/canvas/fbpost?uid=${encodeURIComponent(uid)}&text=${encodeURIComponent(text)}&name=${encodeURIComponent(name)}`;

      // Fetch the image from the API
      const { data: imageResponse } = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 5000 });

      // Convert the response to a base64 image
      const base64Image = Buffer.from(imageResponse).toString('base64');
      const imageUrl = `data:image/png;base64,${base64Image}`;

      // Send the image as an attachment
      await send({
        attachment: { type: 'image', payload: { url: imageUrl } }
      });

    } catch (error) {
      console.error('An error occurred:', error.message);
      send('Failed to generate the Facebook post. Please try again later.');
    }
  },
};
