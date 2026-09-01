const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require('discord.js');

const config = require('../utils/config');

const CUSTOM_API_URL =
  'https://www.torn.com/preferences.php#tab=api?step=addNewKey&user=faction,basic,bounties,discord,personalstats,profile,cooldowns,crimes&torn=attacklog,bounties,crimes&title=Torn%20HQ';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-verification')
    .setDescription('Create the Torn API verification panel.')
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {
    if (interaction.channel.id !== config.channels.enter) {
      return interaction.reply({
        content: '❌ This command can only be used in #Enter.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🔐 API Key Verification')
      .setDescription(
        '**To complete the verification, members must provide their Custom or Full Access API Key.**\n\n' +
        'Every member who joins the server will automatically receive the **Unverified** role. While unverified, they will have limited permissions and can only access the **#Enter** channel.\n\n' +
        'They can only use one command from the Test Bot and can only access the Test Bot app.\n\n' +
        'To gain access to more channels, members must submit their **Custom or Full Access API Key** for verification.'
      )
      .addFields({
        name: '🔑 For Custom API Key',
        value:
          '1️⃣ Click **Custom API Key** below.\n' +
          '2️⃣ It will direct you to the Torn app or website.\n' +
          '3️⃣ The key will appear. **Copy and paste it below.**'
      })
      .addFields({
        name: '✅ After Verification',
        value:
          'Once your API key has been successfully verified, you will receive the **Verified** role.\n\n' +
          'After receiving the Verified role, you will gain access to the **General** category, **Important** category, and the **Service Panel**.'
      })
      .setFooter({
        text: 'Torn HQ • API Key Verification'
      });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Custom API Key')
        .setEmoji('🔑')
        .setStyle(ButtonStyle.Link)
        .setURL(CUSTOM_API_URL),

      new ButtonBuilder()
        .setCustomId('enter_api_key')
        .setLabel('Enter API Key')
        .setEmoji('🔐')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [buttons]
    });
  }
};
