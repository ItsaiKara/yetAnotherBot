// Require the necessary discord.js classes
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token, secondBot } = require('./config.json');
var cron = require('node-cron');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Create a new client instance
const client = new Client({ intents: [
				Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, 
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.GUILD_PRESENCES ], partials: ['MESSAGE','CHANNEL'],
				 });
client.commands = new Discord.Collection();

/****************************************************************
	The part where modules (commands are loaded)
		Loads all the commands from the commands folder
*****************************************************************/
console.log('__________________________________________________');
console.log('============= [INFO] Loading modules =============');
const commands = [];
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	if (command.status != "*") {
		client.commands.set(command.data.name, command);
		console.error(`${command.status} <${command.data.name}>`);
		commands.push(command.data.toJSON());
	}
}
// Registering all the commands from the modules exported earlier
console.log('__________________________________________________');
console.log('========== [INFO] Registering commands ===========');
const rest = new REST({ version: '9' }).setToken(token);
(async () => {
	try {
		console.log('[INFO] Registering (/) commands.');
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log('[INFO] Successfully registered (/) commands.');
	} catch (error) {
		console.error('[ERROR] '+error);
	}
})();

/******************************************************************
 * 			The part where we load the user activity
 * 
 ******************************************************************/
 var jsonUserActivity = require('./userData.json');
 var userVocList = []
 var userVocListOld = []
console.log("[INFO] UserRegistered: ")
console.log(jsonUserActivity)

var mainGuild 
// When the client is ready, run this code (only once)
client.once('ready', async () => {
	console.log('[INFO] Client ready');
	//Function fetching the main guild id 
	const guildGetter = client.guilds.fetch('198415825609162752').then((guild)=>{
		return guild
	})
	mainGuild = await guildGetter
});

function increaseTextActivity(message, type){
	//Increase Value of a key in the userActivity object
	// Type = msg / feur 
	if (jsonUserActivity[message.author.id] == undefined){
		console.log(`[INFO] New entry in userJson (${message.author.username}#${message.author.discriminator} aka ${message.author.id})`)
		jsonUserActivity[message.author.id] = {"msg" : 0, "feur": 0, "voc": 0}
		jsonUserActivity[message.author.id][type]++
		//console.log(jsonUserActivity[message.author.id])
	} else {
		jsonUserActivity[message.author.id][type]++
		//console.log(jsonUserActivity[message.author.id])
	}
}
function increaseVocActivity(){
	for(var el = 0; el < userVocList.length; el++){
		//console.log(userVocList[el])
		id = userVocList[el]
		//console.log(jsonUserActivity[id])
		if(jsonUserActivity[id] === undefined){
			jsonUserActivity[id] = {"msg" : 0, "feur": 0, "voc": 0}
			jsonUserActivity[id]["voc"] ++
			//console.log("0"+jsonUserActivity[id])
		} else {
			jsonUserActivity[id]["voc"] ++
			//console.log("1"+jsonUserActivity[id])
		}
	}
	
}

function updateVocUserList(){
	userVocListOld = [...userVocList]
	userVocList.length = 0
	//Getting the list of users in vc
	//keyListCache = mainGuild.voiceStates.cache
	cache = mainGuild.voiceStates.cache
	cache.forEach((vs, id) => {
		if (vs.channelId == null){
			//console.log("At least one user left")
		} else {
			//console.log(`pushed ${id}`)
			userVocList.push(id)
		}
	});
	//console.log("--------------------------------------------------------------------------------------------------------------------------------------------")
}

function saveDataToJson(){
	var jsonStr = JSON.stringify(jsonUserActivity);
	fs.writeFile('userData.json', jsonStr, (err) => {
		if (err) {
			//throw err;
		}
		console.log("[INFO] JSON user data is saved.");
	});
}

// Executed each msg sent
client.on('messageCreate', async message => {
	if (message.content == "showme"){
		console.log(jsonUserActivity)
	}
	if (!message.author.bot ){
		//checking if message is feur
		//const re = RegExp('\\bquoi\\b|\\bpourquoi\\b', 'g');
		const re = RegExp('(pk\\b)|((pour)?quoi\\b)|koi\\b', 'g');
		let randint = Math.floor(Math.random() * (3 - 0) + 0);
		if (randint == 1){
			var resultReg = re.test(message.content.toLowerCase())
		}
		if (resultReg === true){ //Check if message should be added as feur or regular
			console.log(`[FUN] ${message.author.username}#${message.author.discriminator} got feured`)
			message.channel.send('**FEUR !**')
			let randint = Math.floor(Math.random() * (3 - 0) + 0);
			switch(randint){
				case 0:
					message.channel.send('https://video.twimg.com/ext_tw_video/1554779927244951552/pu/vid/640x332/AWGCJnyb5NgB2XU1.mp4?tag=12')
				break;
				case 1:
					message.channel.send('https://tenor.com/view/feur-meme-gif-24407942')
				break;
				default: 
					message.channel.send('https://tenor.com/view/feur-heart-locket-vred-quoi-quoi-feur-gif-22321210')
				break;
			}
			increaseTextActivity(message, "feur")
		} else {
			increaseTextActivity(message, "msg")			
		}
	}
	//console.log(userVocList)
});

client.on('interactionCreate', async interaction => {

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		//await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

/*----------------------------------------------------------------------------
	Check vocal activity of users

----------------------------------------------------------------------------*/
var vocTimeCt = 0
var userVocTime = cron.schedule('*/30 * * * * *', () => {
	if (vocTimeCt >= 2){
		console.log(`[INFO] UserListSize: ${userVocList.length}, UserListOldSize: ${userVocListOld.length}`)
		vocTimeCt = 0
		saveDataToJson()
	}
	vocTimeCt++
	updateVocUserList()
	increaseVocActivity()
});
userVocTime.start()

client.login(token);