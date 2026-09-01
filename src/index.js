require('dotenv').config();

const {
  Client,
  Collection,
  GatewayIntentBits
} = require('discord.js');

const fs = require('fs');
const path = require('path');

const config = require('./utils/config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();


// ================================
// LOAD COMMANDS
// ================================

const commandsPath = path.join(__dirname, 'commands');

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    try {
      const command = require(filePath);

      if (
        !command.data ||
        typeof command.data.name !== 'string' ||
        typeof command.execute !== 'function'
      ) {
        console.error(`❌ Invalid command file: ${file}`);
        continue;
      }

      client.commands.set(command.data.name, command);

      console.log(`📂 Loaded command: /${command.data.name}`);
    } catch (error) {
      console.error(
        `❌ Failed to load command ${file}: ${error.message}`
      );
    }
  }
}


// ================================
// LOAD EVENTS
// ================================

const eventsPath = path.join(__dirname, 'events');

if (fs.existsSync(eventsPath)) {
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);

    try {
      const event = require(filePath);

      if (
        !event.name ||
        typeof event.execute !== 'function'
      ) {
        console.error(`❌ Invalid event file: ${file}`);
        continue;
      }

      if (event.once) {
        client.once(
          event.name,
          (...args) => event.execute(...args)
        );
      } else {
        client.on(
          event.name,
          (...args) => event.execute(...args)
        );
      }

      console.log(`📂 Loaded event: ${event.name}`);
    } catch (error) {
      console.error(
        `❌ Failed to load event ${file}: ${error.message}`
      );
    }
  }
}


// ================================
// LOGIN
// ================================

if (!config.discordToken) {
  console.error('❌ DISCORD_TOKEN is missing from .env');
  process.exit(1);
}

client.login(config.discordToken)
  .then(() => {
    console.log('🔐 Discord login successful.');
  })
  .catch(error => {
    console.error(
      `❌ Discord login failed: ${error.message}`
    );

    process.exit(1);
  });


// ================================
// ERROR HANDLING
// ================================

process.on('unhandledRejection', error => {
  console.error('❌ Unhandled rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught exception:', error);
});
