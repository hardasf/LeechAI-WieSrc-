const axios = require('axios');

// Remote URL to fetch allowed user IDs (replace with your actual link)
const allowedUsersUrl = 'https://raw.githubusercontent.com/hardasf/LeechAI-WieSrc-/refs/heads/main/ws3/database/allowedusers.json';

async function fetchAllowedUsers() {
  try {
    const { data } = await axios.get(allowedUsersUrl, { timeout: 5000 });
    return data.allowedUsers || []; // Assuming the structure: { allowedUsers: ["123456789", "987654321"] }
  } catch (error) {
    console.error('Failed to fetch allowed users:', error.message);
    return []; // Default to an empty array if request fails
  }
}

module.exports = {
  name: "corn",
  description: "[Premium] Search for corn videos.",
  async run({ event, send, args }) {
    try {
      const userId = event.sender.id;

      // Fetch allowed users from the remote link
      const allowedUsers = await fetchAllowedUsers();

      // Check if the user is allowed
      if (!allowedUsers.includes(userId)) {
        return send("Access denied! Pm https://www.facebook.com/imyourbaby.zxc000hhh to get access ");
      }

      if (args.length === 0) {
        return send('Ano i-se-search ko, lugaw?');
      }

      const query = args.join(' ');
      send(`Searching for: ${query}`);

      const apiUrl = `https://joshweb.click/prn/search/${encodeURIComponent(query)}`;
      const { data: searchResponse } = await axios.get(apiUrl, { timeout: 5000 });

      const videos = searchResponse?.result || [];
      if (videos.length === 0) {
        return send('No video found for the provided query.');
      }

      const firstVideo = videos[0].video;
      const downloadUrl = `https://joshweb.click/prn/download?url=${encodeURIComponent(firstVideo)}`;

      const { data: downloadResponse } = await axios.get(downloadUrl, { timeout: 5000 });
      const videoUrl = downloadResponse.result?.contentUrl?.Default_Quality;

      if (!videoUrl) {
        throw new Error('Error: Link not found!');
      }

      await send({
        attachment: { type: 'video', payload: { url: videoUrl } }
      });

    } catch (error) {
      console.error('An error occurred:', error.message);
      const errorMsg = /No video|Link not found/.test(error.message)
        ? error.message
        : 'An error occurred. Please try again later.';
      send(errorMsg);
    }
  },
};
