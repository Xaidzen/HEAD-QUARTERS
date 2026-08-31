module.exports = {
  guildId: process.env.TARGET_GUILD_ID,

  roles: {
    unverified: process.env.UNVERIFIED_ROLE_ID,
    verified: process.env.VERIFIED_ROLE_ID
  },

  channels: {
    enter: process.env.ENTER_CHANNEL_ID
  },

  torn: {
    apiUrl: 'https://api.torn.com'
  }
};
