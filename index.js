require("dotenv").config();
const { App } = require("@slack/bolt");
const axios = require('axios');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// 1. Ping Command
app.command("/alonzox-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

// 2. Cat Fact Command
app.command("/alonzox-catfact", async ({ ack, respond }) => {
  await ack();
  try {
    const res = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `🐱 **Cat Fact:**\n${res.data.fact}` });
  } catch (err) {
    await respond({ text: "Oops, couldn't fetch a cat fact right now!" });
  }
});

// 3. Roast Command
app.command("/alonzox-roast", async ({ ack, respond }) => {
  await ack();
  try {
    const res = await axios.get("https://evilinsult.com/generate_insult.php?lang=en&type=json");
    await respond({ text: `🔥 **Roast:**\n${res.data.insult}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a roast, but you're doing great anyway!" });
  }
});

// 4. Joke Command
app.command("/alonzox-joke", async ({ ack, respond }) => {
  await ack();
  try {
    const res = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({ text: `😂 **Joke:**\n${res.data.setup}\n> ${res.data.punchline}` });
  } catch (err) {
    await respond({ text: "Couldn't fetch a joke right now!" });
  }
});

// 5. Coin Toss Command
app.command("/alonzox-toss", async ({ ack, respond }) => {
  await ack();
  const result = Math.random() < 0.5 ? "Heads 🪙" : "Tails 🪙";
  await respond({ text: `Coin Toss Result: **${result}**` });
});

// 6. Info Command
app.command("/alonzox-info", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: "🎮 **AlonzoX PS4 Emulator Bot**\nBuilding a custom PS4 emulator to fix pixelation and PostFX glitches."
  });
});

// Start the app
(async () => {
  await app.start();
  console.log("AlonzoX is running!");
})();