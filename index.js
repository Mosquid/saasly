require("dotenv").config()

const { getSaasData } = require("./golden")
const { Telegraf } = require("telegraf")

async function main() {
  const data = await getSaasData()
  const { name, info, icon } = data
  const bot = new Telegraf(process.env.BOT_TOKEN)
  const msg = `${name}\r\n${info}`

  bot.telegram.sendPhoto("@saasly", icon, { caption: msg })
}

main()
