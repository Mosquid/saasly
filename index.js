const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { getSaasData } = require("./golden");
const { Telegraf } = require("telegraf");

async function main() {
  const data = await getSaasData();
  const { name, info, icon } = data;
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const msg = `<b>${name}</b>\r\n\r\n${info}`;

  bot.telegram.sendPhoto(process.env.CHANNEL_NAME, icon, {
    caption: msg,
    parse_mode: "HTML",
  });
}

main();
