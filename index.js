require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  PermissionsBitField,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActivityType,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const http = require('http');

// ✅ Keep-alive server
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.end('Bot is alive!');
}).listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

// ✅ Catch hidden errors
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

// ✅ Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const GUILD_ID              = '1477307154208657520';
const STAFF_ROLE_ID         = '1477310216067354686';
const TICKET_CATEGORY_ID    = '1477312028560592977';
const TRANSCRIPT_CHANNEL_ID = '1477314168901079300';
const TICKET_PANEL_CHANNEL  = '1490651260481704066';
const COLOR                 = 0x6cc5ff;

const NO_FORM_TYPES = ['partnership'];

// ─── TICKET DROPDOWN OPTIONS ──────────────────────────────────────────────────
const ticketOptions = [
  {
    label: "dary's commissions",
    value: 'dary',
    description: 'order a bot developing from dary!',
    emoji: { id: '1477623178669854834', name: 'Blueflower' }
  },
  {
    label: "fleur's commissions",
    value: 'fleur',
    description: 'order roblox clothes from fleur!',
    emoji: { id: '1477622880371085333', name: 'blueturtle' }
  },
  {
    label: 'both commissions',
    value: 'both',
    description: 'order a commission from dary & fleur.',
    emoji: { id: '1477623077608099880', name: 'bunny' }
  },
  {
    label: 'partnership request/concern',
    value: 'partnership',
    description: 'form a partnership request or any concerns.',
    emoji: { id: '1477622961581330514', name: 'blueribbon' }
  }
];

// ─── BOT READY + REGISTER SLASH COMMANDS ─────────────────────────────────────
client.once('clientReady', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  client.user.setActivity('fleurdary creations', {
    type: ActivityType.Watching
  });

  // Register /sendpanel to your server instantly
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  const commands = [
    new SlashCommandBuilder()
      .setName('sendpanel')
      .setDescription('Send the ticket panel (admin only)')
      .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
  ].map(cmd => cmd.toJSON());

  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered to guild.');
  } catch (err) {
    console.error('Failed to register slash commands:', err);
  }
});

// ─── WELCOME MESSAGE ──────────────────────────────────────────────────────────
client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.systemChannel;
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(COLOR)
    .setImage('https://files.catbox.moe/s0n08i.psd')
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

  await channel.send({ embeds: [embed], components: [row] });
});

// ─── INTERACTIONS ─────────────────────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {

  // ── /sendpanel slash command ──
  if (interaction.isChatInputCommand() && interaction.commandName === 'sendpanel') {
    const channel = interaction.guild.channels.cache.get(TICKET_PANEL_CHANNEL);
    if (!channel) return interaction.reply({ content: 'Panel channel not found.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(COLOR)
      .setImage('https://files.catbox.moe/s0n08i.psd')
      .setDescription(
        `<:blueturtle:1477622880371085333> **are you ready to open a ticket?**\n` +
        `\`we cant wait to help you\`\n\n` +
        `<:BlueDot:1478055182679146626> open a ticket & fill out the form\n` +
        `<:white_arrow:1503084978433691791> our team will answer your ticket when available to handle your ticket\n\n` +
        `<:BlueDot:1478055182679146626> choose the appropriate ticket\n` +
        `<:white_arrow:1503084978433691791> make sure to always choose the appropriate ticket in the ticket dropdowns below.\n\n` +
        `<:BlueDot:1478055182679146626> partnerships information\n` +
        `<:white_arrow:1503084978433691791> when opening a partnership ticket there will be no form to be completed, instead wait for a staff member to assist you.\n\n` +
        `<:BlueButterflies:1500462167466704987>`
      );

    const menu = new StringSelectMenuBuilder()
      .setCustomId('ticket_select')
      .setPlaceholder("dary's commissions")
      .addOptions(ticketOptions);

    const row = new ActionRowBuilder().addComponents(menu);

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '<:whitetick:1477663337847324916> Panel sent!', ephemeral: true });
  }

  // ── Dropdown selected ──
  if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
    const type = interaction.values[0];
    const guild = interaction.guild;
    const member = interaction.member;

    const safeName = `${interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}-${type}`;

    const existing = guild.channels.cache.find(c => c.name === safeName);
    if (existing) {
      return interaction.reply({
        content: `<:whitex:1477663429954244733> You already have an open ticket: ${existing}`,
        ephemeral: true
      });
    }

    const ticketChannel = await guild.channels.create({
      name: safeName,
      type: ChannelType.GuildText,
      parent: TICKET_CATEGORY_ID,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: member.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        },
        {
          id: STAFF_ROLE_ID,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageChannels
          ]
        }
      ]
    });

    await interaction.reply({
      content: `<:whitetick:1477663337847324916> Ticket opened ${ticketChannel}`,
      ephemeral: true
    });

    await ticketChannel.send({
      content: `<@&${STAFF_ROLE_ID}> , ${member}`
    });

    const ticketEmbed = new EmbedBuilder()
      .setColor(COLOR)
      .setDescription(`hey, thank you for opening a ticket, someone will help you shortly.`);

    const closeBtn = new ButtonBuilder()
      .setCustomId(`close_${ticketChannel.id}`)
      .setLabel('close')
      .setEmoji({ id: '1500462167466704987', name: 'BlueButterflies' })
      .setStyle(ButtonStyle.Primary);

    const claimBtn = new ButtonBuilder()
      .setCustomId(`claim_${ticketChannel.id}`)
      .setLabel('claim')
      .setEmoji({ id: '1477623178669854834', name: 'Blueflower' })
      .setStyle(ButtonStyle.Primary);

    const btnRow = new ActionRowBuilder().addComponents(closeBtn, claimBtn);
    const ticketMsg = await ticketChannel.send({ embeds: [ticketEmbed], components: [btnRow] });

    if (!NO_FORM_TYPES.includes(type)) {
      const formBtn = new ButtonBuilder()
        .setCustomId(`form_${ticketChannel.id}_${ticketMsg.id}`)
        .setLabel('fill out form')
        .setEmoji({ id: '1477623178669854834', name: 'Blueflower' })
        .setStyle(ButtonStyle.Secondary);

      const formRow = new ActionRowBuilder().addComponents(formBtn);

      await ticketChannel.send({
        content: `${member} please fill out the form below to get started!`,
        components: [formRow]
      });
    }
  }

  // ── Form button clicked ──
  if (interaction.isButton() && interaction.customId.startsWith('form_')) {
    const parts = interaction.customId.split('_');
    const channelId = parts[1];
    const messageId = parts[2];

    const modal = new ModalBuilder()
      .setCustomId(`formsubmit_${channelId}_${messageId}`)
      .setTitle('Commission Form');

    const orderInput = new TextInputBuilder()
      .setCustomId('order_input')
      .setLabel('What do you want to order?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('Describe what you would like to order...');

    const specialInput = new TextInputBuilder()
      .setCustomId('special_input')
      .setLabel('Any special stuff?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('Any special requests, details, or notes...');

    modal.addComponents(
      new ActionRowBuilder().addComponents(orderInput),
      new ActionRowBuilder().addComponents(specialInput)
    );

    await interaction.showModal(modal);
  }

  // ── Form submitted ──
  if (interaction.isModalSubmit() && interaction.customId.startsWith('formsubmit_')) {
    const parts = interaction.customId.split('_');
    const channelId = parts[1];
    const messageId = parts[2];

    const order   = interaction.fields.getTextInputValue('order_input');
    const special = interaction.fields.getTextInputValue('special_input');

    const ticketChannel = interaction.guild.channels.cache.get(channelId);
    if (!ticketChannel) return interaction.reply({ content: 'Could not find the ticket channel.', ephemeral: true });

    const ticketMsg = await ticketChannel.messages.fetch(messageId).catch(() => null);

    if (ticketMsg) {
      const updatedEmbed = new EmbedBuilder()
        .setColor(COLOR)
        .setDescription(
          `hey, thank you for opening a ticket, someone will help you shortly.\n\n` +
          `**What do you want to order?**\n${order}\n\n` +
          `**Any special stuff?**\n${special}`
        );
      await ticketMsg.edit({ embeds: [updatedEmbed] });
    }

    await interaction.message.delete().catch(() => {});
    await interaction.reply({ content: `<:whitetick:1477663337847324916> Form submitted!`, ephemeral: true });
  }

  // ── Claim button ──
  if (interaction.isButton() && interaction.customId.startsWith('claim_')) {
    const hasRole = interaction.member.roles.cache.has(STAFF_ROLE_ID);
    if (!hasRole) {
      return interaction.reply({
        content: `<:whitex:1477663429954244733> You don't have permission to do this!`,
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `<:Blueflower:1477623178669854834> ${interaction.user} has claimed this ticket, they'll be assisting you.`
    });
  }

  // ── Close button ──
  if (interaction.isButton() && interaction.customId.startsWith('close_')) {
    const channelId = interaction.customId.split('_')[1];
    const ticketChannel = interaction.guild.channels.cache.get(channelId);

    await interaction.reply({ content: `<:BlueButterflies:1500462167466704987> Closing ticket and saving transcript...` });

    const transcriptChannel = interaction.guild.channels.cache.get(TRANSCRIPT_CHANNEL_ID);
    if (transcriptChannel) {
      const messages = await ticketChannel.messages.fetch({ limit: 100 });
      const sorted = [...messages.values()].reverse();

      const lines = sorted.map(m =>
        `[${new Date(m.createdTimestamp).toUTCString()}] ${m.author.tag}: ${m.content || '[embed/component]'}`
      ).join('\n');

      const transcriptEmbed = new EmbedBuilder()
        .setColor(COLOR)
        .setTitle('Ticket Closed')
        .setDescription(
          `**Ticket Name:** ${ticketChannel.name}\n` +
          `**Closed by:** ${interaction.user.tag}\n` +
          `**Closed at:** <t:${Math.floor(Date.now() / 1000)}:F>`
        )
        .addFields({
          name: 'Transcript',
          value: lines.length > 1024 ? lines.slice(0, 1021) + '...' : lines || 'No messages.'
        });

      await transcriptChannel.send({ embeds: [transcriptEmbed] });
    }

    setTimeout(() => {
      ticketChannel.delete().catch(console.error);
    }, 3000);
  }

});

// ✅ Login
client.login(process.env.TOKEN);
