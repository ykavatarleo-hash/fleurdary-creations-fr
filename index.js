require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

http.createServer((req, res) => res.end('Bot is alive!')).listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

cclient.login(process.env.TOKEN);
