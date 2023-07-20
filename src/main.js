import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import * as dotenv from "dotenv";
import { ogg } from "./ogg.js";

dotenv.config();

const { TELEGRAM_TOKEN } = process.env;

const bot = new Telegraf(TELEGRAM_TOKEN);

bot.on(message("voice"), async (ctx) => {
  try {
    //    await ctx.reply(JSON.stringify(ctx.message.voice, null, 2));
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = String(ctx.message.from.id);
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);
    // await ctx.reply(JSON.stringify(link, null, 2));
    await ctx.reply(mp3Path);
  } catch (error) {
    console.log(error.message);
  }
});

bot.command("start", async (ctx) => {
  await ctx.reply(JSON.stringify(ctx.message, null, 2));
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
