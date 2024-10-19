const axios = require('axios');

module.exports = {
  name: "corn",
  description: "Search for cornvideos.",
  async run({ api, event, send, args }) {
    try {
      if (args.length === 0) {
        return send('Ano i-se-search ko, lugaw?', event.threadID);
      }

      const { name: senderName } = (await api.getUserInfo(event.senderID))[event.senderID];
      send(`Manyakis ${senderName} is searching for ${args.join(' ')}`, event.threadID);

      const apiUrl = `https://deku-rest-apis.ooguy.com/prn/search/${encodeURIComponent(args.join(' '))}`;
      const { data: searchResponse } = await axios.get(apiUrl);

      const videos = searchResponse.result;
      if (!videos || videos.length === 0) {
        throw new Error('No video found for the provided query.');
      }

      const firstVideo = videos[0].video;
      const downloadUrl = `https://deku-rest-apis.ooguy.com/prn/download?url=${encodeURIComponent(firstVideo)}`;
      const { data: downloadResponse } = await axios.get(downloadUrl);

      const videoUrl = downloadResponse.result.contentUrl.Default_Quality;
      if (!videoUrl) throw new Error('Error: Link not found!');

      // Send the video directly using the URL
      await api.sendMessage(
        {
          body: "Here's the video you requested.",
          attachment: {
            type: 'video',
            payload: { url: videoUrl },
          },
        },
        event.threadID
      );
    } catch (error) {
      console.error(error);
      const errorMsg = error.message.includes('No video') || error.message.includes('Link not found')
        ? error.message
        : 'An error occurred. Please try again.';
      send(errorMsg, event.threadID);
    }
  },
};
