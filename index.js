require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

http.createServer((req, res) => res.end('Bot is alive!')).listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.MTQ3ODExNDQyODU0NDM1NjU5Mw.Gt8Eqm.eimZJRVkl28ZCsEabhDNQQvb3gysYO9MVszLA4);
