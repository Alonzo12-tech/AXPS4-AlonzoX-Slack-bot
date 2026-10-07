const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/alonzox-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/alonzox-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/alonzox-ping - Check bot latency
/alonzox-catfact - Get a cat fact
/alonzox-joke - Get a random joke
/alonzox-toss - Flip a coin (Heads or Tails)
/alonzox-roast - Roast yourself or a tagged friend live`
  });
});

app.command("/alonzox-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/alonzox-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/alonzox-toss", async ({ ack, respond }) => {
  await ack();
  const result = Math.random() < 0.5 ? "Heads 🪙" : "Tails 🪙";
  await respond({ text: `🪙 The coin landed on: *${result}*!` });
});

// Live Roast API Command
app.command("/alonzox-roast", async ({ command, ack, respond }) => {
  await ack();
  const target = command.text.trim() ? command.text.trim() : `<@${command.user_id}>`;

  try {
    const response = await axios.get("https://evilinsult.com/generate_insult.php?lang=en&type=json");
    await respond({ text: `🔥 Hey ${target}, ${response.data.insult}` });
  } catch (err) {
    await respond({ text: `🔥 Hey ${target}, I tried to roast you, but your existence is already roast enough.` });
  }
});

(async () => {
  await app.start();
  console.log("AlonzoX is running!");
})();