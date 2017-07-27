const Discord = require('discord.js');
const bot = new Discord.Client();

var token = "MzM5ODc4NDg1NzU1NDI4ODY0.DFrBxA.79udW8StpzwAvAPaCs_wGEv1Two"

bot.on('message', (message) => {
  if (message.content == 'ping'){
    message.channel.sendMessage('pong');
  }
});

bot.login(token);
