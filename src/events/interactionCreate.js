const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

const verification = require('../modules/verification');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction) {
    try {
      if (interaction.isButton()) {
        if (interaction.customId === 'enter_api_key') {
          const modal = new ModalBuilder()
            .setCustomId('api_key_modal')
            .setTitle('API Key Verification');

          const apiKeyInput = new TextInputBuilder()
            .setCustomId('api_key')
            .setLabel('Torn API Key')
            .setPlaceholder('Enter your Full Access or Custom API key')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(100);

          const row = new ActionRowBuilder()
            .addComponents(apiKeyInput);

          modal.addComponents(row);

          await interaction.showModal(modal);
        }

        return;
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId !== 'api_key_modal') {
          return;
        }

        const apiKey = interaction.fields
          .getTextInputValue('api_key')
          .trim();

        await interaction.deferReply({
          ephemeral: true
        });

        const result = await verification.verifyMember(
          interaction.member,
          apiKey
        );

        await interaction.editReply(
          `✅ **Verification successful!**\n\n` +
          `👤 Torn Account: **${result.tornUser.name}**\n` +
          `🆔 Torn ID: **${result.tornUser.id}**\n\n` +
          `You now have access to the verified member areas.`
        );
      }
    } catch (error) {
      console.error('[VERIFICATION ERROR]', error);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(
          `❌ **Verification failed**\n\n${error.message}`
        );
      } else {
        await interaction.reply({
          content: `❌ **Verification failed**\n\n${error.message}`,
          ephemeral: true
        });
      }
    }
  }
};
