const axios = require('axios');
const fs = require('fs');

module.exports = {
  name: "corn",
  description: "Search for corn videos.",
  async run({ api, event, send, args }) {
    try {
      if (args.length === 0) {
        return send('Ano i-se-search ko, lugaw?');
      }

      send(`Searching for: ${args.join(' ')}`);

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

      const videoPath = await downloadVideo(videoUrl);

      await api.sendMessage(
        {
          body: "Here's the video you requested.",
          attachment: fs.createReadStream(videoPath),
        },
        event.threadID
      );

      fs.unlink(videoPath, (err) => {
        if (err) console.error(`Failed to delete video: ${err.message}`);
        else console.log(`Video deleted: ${videoPath}`);
      });
    } catch (error) {
      console.error(error);
      const errorMsg = error.message.includes('No video') || error.message.includes('Link not found')
        ? error.message
        : 'An error occurred. Please try again.';
      send(errorMsg, event.threadID);
    }
  },
};

async function downloadVideo(url) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const videoPath = `../database/video.mp4`;
    const writer = fs.createWriteStream(videoPath);

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', () => resolve(videoPath));
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Error downloading video: ${error.message}`);
  }
}
