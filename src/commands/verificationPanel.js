const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const config = require('../utils/config');

const CUSTOM_API_URL =
  'https://www.torn.com/preferences.php#tab=api?step=addNewKey&user=faction,basic,bounties,discord,personalstats,profile,cooldowns,crimes&torn=attacklog,bounties,crimes&title=Torn%20HQ';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-verification')
    .setDescription('Create the API Key Verification panel.')
    .setDefaultMemberPermissions('Administrator'),

  async execute(interaction) {
    if (
      interaction.channel.id !==
      config.channels.enter
    ) {
      return interaction.reply({
        content:
          '❌ This panel can only be created in the #Enter channel.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🔐 API Key Verification')
      .setDescription(
        'To complete the verification, members must provide their **Custom or Full Access API Key**.\n\n' +

        'Every member who joins the server will automatically receive the **Unverified** role. While unverified, members will have limited permissions and can only access the **#Enter** channel.\n\n' +

        'To gain access to more channels, submit your **Custom or Full Access API Key** below.'
      )
      .addFields(
        {
          name: '🔑 For Custom API Key',
          value:
            '1️⃣ Click **Custom API Key** below.\n' +
            '2️⃣ It will direct you to the **Torn app or website**.\n' +
            '3️⃣ Your API key will appear. **Copy and paste it below.**'
        },
        {
          name: '✅ After Verification',
          value:
            'Once your API key has been successfully verified, you will receive the **Verified** role.\n\n' +
            'You will then gain access to the **General** category, **Important** category, and **Service Panel**.'
        },
        {
          name: '⚠️ Important',
          value:
            'Never share your Torn API key with other members. Only enter it through the verification button below.'
        }
      )
      .setFooter({
        text: 'Torn HQ • API Key Verification'
      });

    const buttons = new ActionRowBuilder()
      .addComponents(
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
