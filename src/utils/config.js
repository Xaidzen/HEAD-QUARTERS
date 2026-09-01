require('dotenv').config();

module.exports = {
  discordToken: process.env.DISCORD_TOKEN,

  clientId: process.env.CLIENT_ID,

  guildId: process.env.TARGET_GUILD_ID,

  roles: {
    verified: process.env.VERIFIED_ROLE_ID,
    unverified: process.env.UNVERIFIED_ROLE_ID
  },

  channels: {
    enter: process.env.ENTER_CHANNEL_ID,
    service: process.env.SERVICE_CHANNEL_ID
  },

  tornApiUrl:
    process.env.TORN_API_URL || 'https://api.torn.com'
};
