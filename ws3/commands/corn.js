const axios = require('axios');

module.exports = {
  name: "corn",
  description: "Search for corn videos.",
  async run({ event, send, args }) {
    try {
      if (args.length === 0) {
        return send('Ano i-se-search ko, lugaw?');
      }

      const query = args.join(' ');
      send(`Searching for: ${query}`);

      const apiUrl = `https://joshweb.click/prn/search/${encodeURIComponent(query)}`;
      const { data: searchResponse } = await axios.get(apiUrl);

      const videos = searchResponse.result;
      if (!videos || videos.length === 0) {
        throw new Error('No video found for the provided query.');
      }

      const firstVideo = videos[0].video;
      const downloadUrl = `https://joshweb.click/prn/download?url=${encodeURIComponent(firstVideo)}`;
      const { data: downloadResponse } = await axios.get(downloadUrl);

      const videoUrl = downloadResponse.result.contentUrl.Default_Quality;
      if (!videoUrl) throw new Error('Error: Link not found!');

      // Send the video directly using the video URL as an attachment
      await send({
        body: "Here's the video you requested.",
        attachment: { type: 'video', payload: { url: videoUrl } }
      });
    } catch (error) {
      console.error(error);
      const errorMsg = error.message.includes('No video') || error.message.includes('Link not found')
        ? error.message
        : 'An error occurred. Please try again.';
      send(errorMsg);
    }
  },
};
