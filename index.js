const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { getSaasData } = require("./golden");
const { Telegraf } = require("telegraf");
let attempts = 5;

async function main() {
  try {
    const data = await getSaasData();
    const { name, info, icon } = data;
    const bot = new Telegraf(process.env.BOT_TOKEN);
    const msg = `<b>${name}</b>\r\n\r\n${info}`;

    bot.telegram.sendPhoto(process.env.CHANNEL_NAME, icon, {
      caption: msg,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error(error);
    if (attempts > 0) {
      attempts--;
      main();
    }
  }
}

main();
