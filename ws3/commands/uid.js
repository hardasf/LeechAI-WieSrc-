const axios = require("axios");
const name = "uid";

module.exports = {
  name,
  description: "Fetch the UID from a Facebook profile link.",
  async run({ api, event, send, args }) {
    const profileUrl = args.join(" ");
    if (!profileUrl) 
      return send(`Please enter a Facebook profile URL!

Example: ${api.prefix + name} https://www.facebook.com/your-profile`);

    send("Fetching UID... 🔎");
    
    try {
      const response = await axios.get(`https://deku-rest-apis.ooguy.com/api/findid`, {
        params: { url: profileUrl }
      });

      const { status, result } = response.data;

      if (status) {
        send(`✅ UID Found: ${result}`);
      } else {
        throw new Error("Failed to fetch the UID. Please try again.");
      }
    } catch (err) {
      send(`Error: ${err.message || err}`);
    }
  }
};