const axios = require('axios');

module.exports = {
  name: 'shoti',
  description: 'Fetch a TikTok video and send the details along with the video.',
  async run({ api, event, send }) {
    const senderId = event.sender.id;
    const predefinedUrl = 'https://vt.tiktok.com/ZSYwJSnwn/';
    const apiUrl = `https://shoti.kenliejugarap.com/getvideo.php?apikey=shoti-3673ed33bc8186f@b37aba4c425fa@36@e6f30c0863dae181779bad3ee08@6ae95834eb@c8d1ccdf1d21a@b5@b4dc41afe7d@b8063f202@19c1c3fbf7bf1cbb@b1cac4b2d71fabc6c1b760ac0769490baaf4e6@c50&url=${encodeURIComponent(predefinedUrl)}`;

    try {
      const { data } = await axios.get(apiUrl);

      if (data.status && data.videoDownloadLink) {
        const { title = 'No Title', videoDownloadLink } = data;
        
        const detailsMessage = { text: `Title: ${title}` };
        const videoMessage = {
          attachment: {
            type: 'video',
            payload: { url: videoDownloadLink }
          }
        };

        await Promise.all([
          send(detailsMessage),
          send(videoMessage)
        ]);
      } else {
        await sendError(send, 'Error: Unable to fetch video details.');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      await sendError(send, 'Error: Unexpected error occurred while fetching the video.');
    }
  },
};

const sendError = async (send, errorMessage) => {
  await send({ text: errorMessage });
};
