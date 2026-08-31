module.exports = {
  name: 'interactionCreate',

  async execute(interaction) {

    // ================================
    // SLASH COMMANDS
    // ================================

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(
        interaction.commandName
      );

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '❌ Something went wrong while running this command.',
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: '❌ Something went wrong while running this command.',
            ephemeral: true
          });
        }
      }

      return;
    }

    // ================================
    // BUTTONS
    // ================================

    if (interaction.isButton()) {

      if (interaction.customId === 'verify_account') {

        await interaction.reply({
          content: '🔐 Verification system is ready. API key setup will be added next!',
          ephemeral: true
        });

      }

    }

  }
};
