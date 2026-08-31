require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Collection
} = require('discord.js');

const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// ================================
// LOAD COMMANDS
// ================================

const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);

  console.log(`📂 Loaded command: /${command.data.name}`);
}

// ================================
// LOAD EVENTS
// ================================

const eventsPath = path.join(__dirname, 'events');

const eventFiles = fs
  .readdirSync(eventsPath)
  .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }

  console.log(`📂 Loaded event: ${event.name}`);
}

// ================================
// LOGIN
// ================================

client.login(process.env.DISCORD_TOKEN);
