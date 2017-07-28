const Discord = require('discord.js');
const bot = new Discord.Client();
const YTDL = require("ytdl-core");
const embed = new Discord.RichEmbed()

const PREFIX = '//'; // Command Prefix

var token = "";

var voiceChannel = null;
var servers = {};

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
    command:"hug",
    description: "Send a user a hug",
    parameters: ['user'],
    execute: function(message, params){
      var rand =  Math.floor(Math.random() * NUM_HUG);

      embed.setImage(hug[rand].link)

      message.channel.sendMessage(params[1] + ", " + message.member + " hugged you", {embed});
    }
  },
  {
    command:"cry",
    description: "sad bois",
    parameters: [],
    execute: function(message, params){
      var rand =  Math.floor(Math.random() * NUM_CRY);

      embed.setImage(cry[rand].link)

      message.channel.sendMessage("", {embed});
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
    command: "time",
    description: "Returns the time",
    parameters:[],
    execute: function(message, params){
      var d = new Date();
      var hours;
      var minutes = d.getUTCMinutes();
      var t;

      if (d.getUTCHours() == 0){
        hours = 12;
      } else {
        hours = (d.getUTCHours() % 12);
      }
      hours -= 6;

      if (minutes < 10){
        minutes = "0" + minutes;
      }

      if ((d.getUTCHours() % 12 - 6) >= 6){
        t = "A.M.";
      } else {
        t = "P.M.";
      }

      message.channel.sendMessage("It's only " + hours + ":" + minutes + " " + t);
    }
  },
  {
    command: "echo",
    description: "Repeats the user",
    parameters:['text'],
    execute: function (message, params){
      var text = "";
      count = 1;
      while(params[count]){
        text += params[count] + " ";
        count++;
      }
      message.channel.sendMessage(text);
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

      // If the queue is empty create one
      if (!servers[message.guild.id]){
        servers[message.guild.id] = {
          queue: []
        };
      }

      var server = servers[message.guild.id];
      server.queue.push(params[1]); // Adds a song to the queue

      if (!message.guild.voiceConnection){
        message.member.voiceChannel.join().then(function(connection){
          play(connection, message); // Start the player
        });
      }

    }
  },
  {
    command: "stop",
    description: "Stops playing music",
    parameters:[],
    execute: function(message, params){
      /*
      message.member.voiceChannel.join().then(function(connection){
        connection.disconnect();
      });*/
      if (message.guild.voiceConnection){
        message.guild.voiceConnection.disconnect();
      }
    }
  },
  {
    command: "skip",
    description: "Skips the current song",
    parameters:[],
    execute: function(message, params){
      var server = servers[message.guild.id];

      if (server.dispatcher){
        server.dispatcher.end();
      }
    }
  },
  /*{
    command: "queue",
    description: "Displays the current music queue",
    parameters:[],
    execute: function(message, params){
      var queue = "QUEUE:\n";
      var server = servers[message.guild.id];
      var count = 0;

      while(server.queue[count]){
        queue += (count + 1 ) + ". " + server.queue[count] + "\n";
        count++;
      }
      message.channel.sendMessage(queue);
    }
  }*/
];

function play(connection, message){
  var server = servers[message.guild.id];

  try{
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter:'audioonly'}));

    server.dispatcher.on('end', function(){ // On song end
      server.queue.shift(); //Remove first song from the queue
      if (server.queue[0]){ // Check if there are more songs in the queue
        play(connection, message); // Play next song
      } else {
        connection.disconnect(); // Disconnect bot when there are no more songs in the queue
      }
    });
  } catch(err){
    message.channel.sendMessage('Invalid link!');
    server.queue.shift();
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

const NUM_KISS = 6;
// Kiss Gifs
var kiss = [
  {link:'https://media0.giphy.com/media/l0Eryp2ZPdCmeMIb6/giphy.gif'},
  {link:'https://scontent.fyyz1-1.fna.fbcdn.net/v/t1.0-9/14191941_10205738006688913_6874955034717212194_n.jpg?oh=38dfc711445fd42464a664378c58c197&oe=5A0A1521'},
  {link:'https://media2.giphy.com/media/3o72FiXBdWRy3aZHJm/giphy.gif'},
  {link:'https://media1.giphy.com/media/10UUe8ZsLnaqwo/giphy.gif'},
  {link:'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif'},
  {link:'https://media2.giphy.com/media/CdFWnuCgiMPte/giphy.gif'}
];

const NUM_HUG = 6;
// Hug Gifs
var hug = [
  {link:'https://media2.giphy.com/media/mmPgxbuPiwCQg/giphy.gif'},
  {link:'https://media0.giphy.com/media/8tpiC1JAYVMFq/giphy.gif'},
  {link:'https://media1.giphy.com/media/X4pI9XchDNsu4/giphy.gif'},
  {link:'https://media0.giphy.com/media/OiKAQbQEQItxK/giphy.gif'},
  {link:'https://media3.giphy.com/media/LSOCIyd7LRjRS/giphy.gif'},
  {link:'https://media2.giphy.com/media/lXiRKBj0SAA0EWvbG/giphy.gif'}
];

const NUM_CRY = 5;
// Hug Gifs
var cry = [
  {link:'https://media0.giphy.com/media/Xs4TtKRfCTE9G/giphy.gif'},
  {link:'https://media1.giphy.com/media/26FPImXfDlv4AFbBC/giphy.gif'},
  {link:'https://media1.giphy.com/media/2Z5sMN0DSuAP6/giphy.gif'},
  {link:'https://media0.giphy.com/media/4NuAILyDbmD16/giphy.gif'},
  {link:'https://media1.giphy.com/media/tSVJrUNa15oA0/giphy.gif'}
];
