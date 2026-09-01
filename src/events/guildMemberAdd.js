const config = require('../utils/config');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member) {
    if (member.guild.id !== config.guildId) {
      return;
    }

    try {
      const unverifiedRole =
        member.guild.roles.cache.get(
          config.roles.unverified
        );

      if (!unverifiedRole) {
        console.error(
          '❌ Unverified role was not found.'
        );
        return;
      }

      await member.roles.add(unverifiedRole);

      console.log(
        `👤 Added Unverified role to ${member.user.tag}`
      );
    } catch (error) {
      console.error(
        '❌ Failed to assign Unverified role:',
        error
      );
    }
  }
};
