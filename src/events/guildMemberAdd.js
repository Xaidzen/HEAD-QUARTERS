const config = require('../utils/config');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member) {
    if (member.guild.id !== config.guildId) {
      return;
    }

    try {
      const role = member.guild.roles.cache.get(
        config.roles.unverified
      );

      if (!role) {
        console.error('❌ Unverified role not found.');
        return;
      }

      if (!role.editable) {
        console.error(
          '❌ Bot cannot assign the Unverified role. Check role hierarchy.'
        );
        return;
      }

      await member.roles.add(role);

      console.log(
        `👤 Added Unverified role to ${member.user.tag}`
      );
    } catch (error) {
      console.error(
        `❌ Failed to assign Unverified role: ${error.message}`
      );
    }
  }
};
