const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

const verification = require('../modules/verification');
const config = require('../utils/config');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction) {
    try {
      // Enter API Key button
      if (
        interaction.isButton() &&
        interaction.customId === 'enter_api_key'
      ) {
        if (
          interaction.channel.id !==
          config.channels.enter
        ) {
          return interaction.reply({
            content:
              '❌ API verification is only available in #Enter.',
            ephemeral: true
          });
        }

        const modal = new ModalBuilder()
          .setCustomId('api_key_modal')
          .setTitle('API Key Verification');

        const apiKeyInput = new TextInputBuilder()
          .setCustomId('api_key')
          .setLabel('Torn API Key')
          .setPlaceholder(
            'Paste your Full Access or Custom API key'
          )
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMinLength(10)
          .setMaxLength(100);

        const row = new ActionRowBuilder()
          .addComponents(apiKeyInput);

        modal.addComponents(row);

        return interaction.showModal(modal);
      }

      // API key modal
      if (
        interaction.isModalSubmit() &&
        interaction.customId === 'api_key_modal'
      ) {
        const apiKey = interaction.fields
          .getTextInputValue('api_key')
          .trim();

        await interaction.deferReply({
          ephemeral: true
        });

        const result =
          await verification.verifyMember(
            interaction.member,
            apiKey
          );

        const serviceChannel =
          config.channels.service
            ? `<#${config.channels.service}>`
            : '**Service Channel**';

        await interaction.editReply(
          `## ✅ Verification Successful!\n\n` +
          `Verification successful! Thank you, <@${interaction.user.id}>, for joining us! 😊🤝\n\n` +
          `Please proceed to the ${serviceChannel} to access:\n\n` +
          `> 💰 **Loss Seller**\n` +
          `> 💵 **Loss Buyer**\n` +
          `> 🏃 **Escape Seller**\n` +
          `> 🎯 **Bounty Seller**\n` +
          `> 🔓 **Bust Seller**\n` +
          `> ✨ **And more!**\n\n` +
          `We're glad to have you here. **Welcome!** 🤝`
        );
      }
    } catch (error) {
      console.error(
        '[VERIFICATION ERROR]',
        error
      );

      const message =
        `❌ **Verification Failed**\n\n${error.message}`;

      if (
        interaction.deferred ||
        interaction.replied
      ) {
        await interaction.editReply(message);
      } else {
        await interaction.reply({
          content: message,
          ephemeral: true
        });
      }
    }
  }
};
