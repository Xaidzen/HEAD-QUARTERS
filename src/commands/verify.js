
const {
  SlashCommandBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify a member manually.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The member to verify.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions('Administrator'),

  async execute(interaction) {
    const user = interaction.options.getUser('user');

    await interaction.reply({
      content:
        `⚠️ Manual verification for <@${user.id}> is not implemented yet.`,
      ephemeral: true
    });
  }
};
