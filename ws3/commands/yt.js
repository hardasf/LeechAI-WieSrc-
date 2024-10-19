const name = "yt" ;

module.exports = {
  name,
  description: "Play a music video from YouTube.",
  async run({ api, send, event, args }) {
    const fs = require("fs-extra");
    const ytdl = require("ytdl-core");
    const yts = require("yt-search");

    const videoName = args.join(' ');

    if (!videoName) {
      return send('To start, type "music video" followed by the title of the video you want to play.');
    }

    try {
      await send(`Searching for "${videoName}"...`);

      const searchResults = await yts(videoName);

      if (!searchResults.videos.length) {
        return send("No video found with that title.");
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;
      const stream = ytdl(videoUrl, { filter: "audioandvideo" });

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filePath = `cache/${timestamp}_music_video.mp4`;

      // Ensure the cache directory exists
      fs.ensureDirSync('cache');

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('end', async () => {
        try {
          const fileSize = fs.statSync(filePath).size;

          if (fileSize > 26214400) { // 25MB limit
            fs.unlinkSync(filePath);
            return send('The video is too large to send (over 25MB).');
          }

          await send({
            body: video.title,
            attachment: fs.createReadStream(filePath),
          });

          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(err);
          await send('An error occurred while sending the video.');
        }
      });

    } catch (error) {
      console.error(error);
      await send('An error occurred while processing your request.');
    }
  },
};