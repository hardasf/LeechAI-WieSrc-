module.exports = {
  description: "What is LeechAI?",
  async run({ api, send, admin }){
    await send({
      attachment: {
        type: "image",
        payload: {
          url: "https://i.imgur.com/gw1V46p.jpeg",
          is_reusable: true
        }
      }
    });
    setTimeout(async () => await send({
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `🤖 About LeechAI:
LeechAI is your friendly, helpful personal assistant.

💭 This project is forked from WieAI 

❓ Contact us admins if you experienced/encountered any issue regarding to the bot and I will try to fix it. Thankyou for using me as a personal assistant!`,
          buttons: [
            {
              type: "web_url",
              url: "https://www.facebook.com/leechshares",
              title: "Like/Follow our Page"
                },
            {
              type: "web_url",
              url: "https://www.facebook.com/imyourbaby.zxc000hhh",
              title: "Contact Admin 1"
                }

             ]
        }
      }
    }), 2*1000);
  }
}
