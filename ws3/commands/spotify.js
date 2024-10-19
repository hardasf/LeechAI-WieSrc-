const axios = require("axios");
const name = "spotify";
const fs = require("fs");
const path = require("path");

module.exports = {
  name,
  description: "Search for a Spotify track using a keyword",
  async run({ api, send, args }) {
    const searchQuery = args.join(" ");
    
    if (!searchQuery) return send(`Usage: ${api.prefix + name} [music title]`);

    try {
      const res = await axios.get('https://hiroshi-api.onrender.com/tiktok/spotify', {
        params: { search: searchQuery }
      });

      if (!res || !res.data || res.data.length === 0) throw new Error("No results found");

      const { name: trackName, download, image, track } = res.data[0];
      
      // Send the track name and Spotify link
      send(`🎶 Now playing: ${trackName}\n\n🔗 Spotify Link: ${track}`);
      
      // Download the MP3 file
      const mp3Path = path.resolve(__dirname, `${trackName}.mp3`);
      const writer = fs.createWriteStream(mp3Path);

      const response = await axios({
        url: download,
        method: 'GET',
        responseType: 'stream',
      });

      response.data.pipe(writer);

      writer.on('finish', () => {
        // Send the audio file as an attachment after the message
        send({
          attachment: {
            type: "audio",
            payload: {
              url: download
            }
          }
        });
      });

      writer.on('error', (error) => {
        send(`Error downloading the track: ${error.message}`);
      });

    } catch (error) {
      send("Error retrieving the Spotify track. Please try again or check your input.\n" + (error.message || error));
    }
  }
};
