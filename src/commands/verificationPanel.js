const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const config = require('../utils/config');

const CUSTOM_API_URL =
  'https://www.torn.com/preferences.php#tab=api?step=addNewKey&user=faction,basic,bounties,discord,personalstats,profile,cooldowns,crimes&torn=attacklog,bounties,crimes&title=Torn%20HQany=profile';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verification-panel')
    .setDescription('Send the API Key Verification panel.')
    .setDefaultMemberPermissions('Administrator'),

  async execute(interaction) {
    if (interaction.channel.id !== config.channels.enter) {
      return interaction.reply({
        content: '❌ This panel can only be used in the Enter channel.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🔐 API Key Verification')
      .setDescription(
        '**To complete the verification, members must provide their Custom or Full Access API Key.**\n\n' +
        'To gain access to more channels, submit your **Custom or Full Access API Key** below.\n\n' +
      )
      .setFooter({
        text: 'Your API key is used only for verification.'
      });

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Click for Custom API Key')
          .setStyle(ButtonStyle.Link)
          .setURL(CUSTOM_API_URL),

        new ButtonBuilder()
          .setCustomId('enter_api_key')
          .setLabel('Enter API Key')
          .setStyle(ButtonStyle.Primary)
      );

    await interaction.reply({
      embeds: [embed],
      components: [buttons]
    });
  }
};
