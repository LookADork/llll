const Discord = require('discord.js');
const bot = new Discord.Client();

const PREFIX = '//'; // Command Prefix

var token = "MzM5ODc4NDg1NzU1NDI4ODY0.DFrBxA.79udW8StpzwAvAPaCs_wGEv1Two"

// JSON for JWU quotes
var jwu_quotes = [
  {"quote": "You're a bot" },
  {"quote": "I need to go make salad" },
  {"quote": "Wanna play old school Runescape?" },
  {"quote": "IBuyPower got unbanned" },
  {"quote": "I got banned for botting in Runescape" },
  {"quote": "New year new me" },
  {"quote": "If you die in the first 10 seconds I'm not playing anymore" },
  {"quote": "I have to wake up at 6 A.M." }
];

// List of commands in json format
var commands = [
  {
    command: "help",
    description: "",
    parameters: [],
    execute: function(message, params){
      var list_of_commands = "To run a command use the prefix, " + PREFIX + " , and attach one of the commands below. For example, " + PREFIX + "ping\n\n";
      var count = 1;
      var com, des;
      var commands_header = "__**Available commands**__\n\n"

      list_of_commands += commands_header;

      while (commands[count] != null){ // Goes through the list of commands
        com = "__**" + commands[count].command + "**__";// Gets the command
        des = commands[count].description;
        list_of_commands += com + ": " + des + "\n"; //Append the command to the string
        count++;
      }

      message.author.sendMessage(list_of_commands);// PMs the user the list of commands
    }
  },
  {
    command: "ping",
    description: "Responds with pong",
    parameters: [],
    execute: function(message, params){
      message.channel.sendMessage('pong');
    }
  },
  {
    command:"roll",
    description: "Rolls a dice",
    parameters: [],
    execute: function(message, params){
      var roll =  Math.floor(Math.random() * 6) + 1;
      message.reply("You rolled a " + roll)
    }
  },
  {
    command:"flip",
    description: "Flips a coin",
    parameters: [],
    execute: function(message, params){
      var flip =  Math.floor(Math.random() * 2) + 1;
      if (flip == 1){
        message.reply("Heads");
      } else {
        message.reply("Tails");
      }
    }
  },
  {
    command:"shitjwusays",
    description: "Sends a random JWU 2k17 quote",
    parameters:[],
    execute: function(message, params){
      const NUM_JWU_QUOTES = 8;
      var rand =  Math.floor(Math.random() * NUM_JWU_QUOTES);
      message.channel.sendMessage(jwu_quotes[rand].quote);
    }
  }
];

bot.on('message', (message) => {
  var msg = message.content;
  var pre = msg[0] + "" + msg[1];

  if (pre == PREFIX){ // Check if a command has been executed
    execute_command(message, msg.substring(2));
  }
});

// Executes the command
function execute_command(message, text){
  var params = text.split(" ");
	var command = search_command(params[0]);

	if(command) {
		if(params.length - 1 < command.parameters.length) {
			message.reply("Insufficient parameters!");
		} else {
			command.execute(message, params);
		}
	} else{
    message.reply("Invalid command!");
  }
}

// Traverses the commands and tries to find the command specified by the user
function search_command(command_name) {
	for(var i = 0; i < commands.length; i++) {
		if(commands[i].command == command_name.toLowerCase()) {
			return commands[i];
		}
	}

	return false;
}

bot.login(token);
