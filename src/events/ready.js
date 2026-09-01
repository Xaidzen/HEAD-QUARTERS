module.exports = {
  name: 'ready',
  once: true,

  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`🏠 Connected to ${client.guilds.cache.size} server(s)`);
  }
};
