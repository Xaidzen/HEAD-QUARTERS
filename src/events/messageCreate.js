module.exports = {
  name: 'messageCreate',

  async execute(message) {
    if (message.author.bot) return;

    console.log(
      `📩 ${message.author.tag}: ${message.content}`
    );
  }
};
