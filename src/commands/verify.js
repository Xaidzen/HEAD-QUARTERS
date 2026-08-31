const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const DESIGN = require('../utils/design');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your Torn City account'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(DESIGN.colors.primary)
      .setTitle(`${DESIGN.emojis.verified} ${DESIGN.verification.title}`)
      .setDescription(DESIGN.verification.description)
      .setFooter({
        text: DESIGN.footer.text
      });

    const button = new ButtonBuilder()
      .setCustomId('verify_account')
      .setLabel(DESIGN.verification.buttonText)
      .setEmoji(DESIGN.emojis.verified)
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
