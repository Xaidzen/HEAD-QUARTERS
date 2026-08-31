const config = require('../utils/config');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member) {
    try {
      if (member.guild.id !== config.guildId) {
        return;
      }

      const unverifiedRole =
        member.guild.roles.cache.get(
          config.roles.unverified
        );

      if (!unverifiedRole) {
        console.error(
          '❌ Unverified role not found.'
        );
        return;
      }

      await member.roles.add(unverifiedRole);

      console.log(
        `✅ Unverified role added to ${member.user.tag}`
      );
    } catch (error) {
      console.error(
        `❌ Failed to add Unverified role: ${error.message}`
      );
    }
  }
};
