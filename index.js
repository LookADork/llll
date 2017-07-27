const Discord = require('discord.js');
const bot = new Discord.Client();
const YTDL = require("ytdl-core");
const embed = new Discord.RichEmbed()

const PREFIX = '//'; // Command Prefix

var token = "MzM5ODc4NDg1NzU1NDI4ODY0.DFrBxA.79udW8StpzwAvAPaCs_wGEv1Two";

var voiceChannel = null;
var servers = {};
var queue = [];
var isPlaying = false;

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
    command:"kiss",
    description: "Send a user a kiss",
    parameters: ['user'],
    execute: function(message, params){
      var rand =  Math.floor(Math.random() * NUM_KISS);

      embed.setImage(kiss[rand].link)

      message.channel.sendMessage(params[1] + ", you got a kiss from " + message.member, {embed});
    }
  },
  {
    command:"shitjwusays",
    description: "Sends a random JWu 2k17 quote",
    parameters:[],
    execute: function(message, params){
      var rand =  Math.floor(Math.random() * NUM_JWU_QUOTES);
      message.channel.sendMessage(jwu_quotes[rand].quote);
    }
  },
  {
    command:"pubgstrats",
    description: "Tells you which strat to run on your next pubg game",
    parameters:[],
    execute: function(message, params){
      var rand =  Math.floor(Math.random() * NUM_STRATS);
      message.channel.sendMessage(pubgstrats[rand].strat);
    }
  },
  {
    command: "everydaybro",
    description: "Plays Everyday Bro",
    parameters:[],
    execute: function(message, params){
      var voiceChannel;

      if (!message.member.voiceChannel){ // User is not in a voice channel
        message.channel.sendMessage("You must be in a voice channel to use this command");
      } else {
        voiceChannel = message.member.voiceChannel; // Find the voice channel that the message was entered from
        voiceChannel.join().then(function(connection){ // Bot joins the voice channel
          playEverydayBro(connection, message);
        });
      }

    }
  },
  {
    command: "team10hours",
    description: "Everyday Bro 10 hours",
    parameters:[],
    execute: function(message, params){
      var voiceChannel;

      if (!message.member.voiceChannel){ // User is not in a voice channel
        message.channel.sendMessage("You must be in a voice channel to use this command");
      } else {
        voiceChannel = message.member.voiceChannel; // Find the voice channel that the message was entered from
        voiceChannel.join().then(function(connection){ // Bot joins the voice channel
          playEverydayBro10(connection, message);
        });
      }

    }
  },
  {
    command: "play",
    description: "Plays the given youtube link",
    parameters:['yt_link'],
    execute: function(message,params){


      if (!message.member.voiceChannel){ // User is not in a voice channel
        message.channel.sendMessage("You must be in a voice channel to use this command");
        return;
      }

      if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue:[]
      };

      var server = servers[message.guild.id];

      if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
        if (isPlaying){ //Player is already playing
          queue = queue.concat(params[1]);
        } else { //Player is not playing
          queue = queue.concat(params[1]);
          isPlaying = true;
          play(connection, message);
        }
      });
    }
  },
  {

  },
  {
    command: "stop",
    description: "Stops playing music",
    parameters:[],
    execute: function(message, params){
      voiceChannel = message.member.voiceChannel;
      voiceChannel.join().then(function(connection){ // Bot joins the voice channel
        connection.disconnect();
      });
      queue = [];
      isPlaying = false;
    }
  }
];

function play(connection, message){
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(queue[0], {filter:'audioonly'}));

  shift(queue); //Remove first song from the queue

  server.dispatcher.on('end', function(){ // On song end
    if (queue[0] != null){ // Check if there are more songs in the queue
       play(connection, message); // Play next song
    } else {
      connection.disconnect(); // Disconnect bot when there are no more songs in the queue
    }
  });
}

function shift(queue){
  var count = 1;

  queue[0] = null;

  while (queue[count] != null){
    queue[count - 1] = queue[count];
    count++;
  }
}

// Plays Everyday bro
function playEverydayBro(connection, message){
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL("https://www.youtube.com/watch?v=hSlb1ezRqfA", {filter:'audioonly'}));

  server.dispatcher.on(end, function(){
    connection.disconnect();
  });
}

// Plays everydaybro 10 hours
function playEverydayBro10(connection, message){
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL("https://www.youtube.com/watch?v=vQs5qyQit7Y", {filter:'audioonly'}));

  server.dispatcher.on(end, function(){
    connection.disconnect();
  });
}

bot.on('ready', () => {
  bot.user.setGame('Type ' + PREFIX + 'help')
});

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

// Definitions

const NUM_JWU_QUOTES = 9;
// JSON for JWU quotes
var jwu_quotes = [
  {"quote": "You're a bot" },
  {"quote": "I need to go make salad" },
  {"quote": "Wanna play old school Runescape?" },
  {"quote": "IBuyPower got unbanned" },
  {"quote": "I got banned for botting in Runescape" },
  {"quote": "New year new me" },
  {"quote": "If you die in the first 10 seconds I'm not playing anymore" },
  {"quote": "I have to wake up at 6 A.M." },
  {"quote": "Reuben's not toxic" }
];

const NUM_STRATS = 6;
// Pubg Strats
var pubgstrats = [
  {strat: "Drop Big Box"},
  {strat: "Drop Titties"},
  {strat: "AFK Strat"},
  {strat: "Spawn Island"},
  {strat: "Land away from ZICO and get flamed"},
  {strat: "Don't pick up anything less than a 4x scope. You can just hold shift"}
];

const NUM_KISS = 5;
// Kiss Gifs
var kiss = [
  {link:'https://media0.giphy.com/media/l0Eryp2ZPdCmeMIb6/giphy.gif'},
  {link:'https://scontent.fyyz1-1.fna.fbcdn.net/v/t1.0-9/14191941_10205738006688913_6874955034717212194_n.jpg?oh=38dfc711445fd42464a664378c58c197&oe=5A0A1521'},
  {link:'https://media2.giphy.com/media/3o72FiXBdWRy3aZHJm/giphy.gif'},
  {link:'https://media1.giphy.com/media/10UUe8ZsLnaqwo/giphy.gif'},
  {link:'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif'}
];
