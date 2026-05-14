require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActivityType
} = require('discord.js');

const http = require('http');

// ✅ Keep server alive (important for hosting platforms)
http.createServer((req, res) => {
  res.end('Bot is alive!');
}).listen(process.env.PORT || 3000);

// ✅ Catch hidden errors
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

// ✅ Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ✅ FIXED: correct event name
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setActivity('fleurdary creations', {
    type: ActivityType.Watching
  });
});

// ✅ Welcome message
client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.systemChannel;
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(0x6cc5ff)
    .setImage('https://cdn.discordapp.com/attachments/1477314303282647111/1503004845752455188/IMG_6471.jpg')
    .setDescription(
      `# <:blueturtle:1477622880371085333> Welcome to fleurdary creations.\n\n` +
      `${member}\n\n` +
      `hey and welcome to **fleurdary creations!** in here we offer clothing & bot developing - but we are looking to expand our services. make sure to grab your roles and have fun. any questions? feel free to ask.`
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Information')
      .setEmoji('<:rulesf:1503084892773155019>')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/channels/1477307154208657520/1477312209003483326'),

    new ButtonBuilder()
      .setLabel('Order Here')
      .setEmoji('<a:Sparkles12:1477623769374920736>')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/channels/1477307154208657520/1490651260481704066')
  );

  await channel.send({
    embeds: [embed],
    components: [row]
  });
});

// ✅ Make sure this matches your env variable name in Remoud
client.login(process.env.TOKEN);
