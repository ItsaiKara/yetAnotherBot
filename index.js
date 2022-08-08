// Require the necessary discord.js classes
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
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
				Intents.FLAGS.GUILD_PRESENCES ], partials: ['MESSAGE','CHANNEL'] });
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


client.on('messageCreate', async message => {
	if (!message.author.bot ){
		const re = RegExp('\\bquoi\\b|\\bpourquoi\\b', 'g');
		let resultReg = re.test(message.content.toLowerCase())
		if (resultReg === true){
			console.log(`[FUN] ${message.author.username}#${message.author.discriminator} got feured`)
			message.channel.send('https://video.twimg.com/ext_tw_video/1554779927244951552/pu/vid/640x332/AWGCJnyb5NgB2XU1.mp4?tag=12')
		}
	}
});

client.on('interactionCreate', async interaction => {

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


/*----------------------------------------------------------------------------
	Parity bot checker
------------------------------------------------------------------------------*/
var pingTimer = 99
var marcoTime = cron.schedule('*/5 * * * * *', () => {
	const tmp = mainGuild.members.fetch(secondBot).then((member)=>{
			if (member.presence != null) {
				//console.log(member.presence.status + " " + pingTimer)		
				if(member.presence.status == "offline"){
					if (pingTimer >= 100) {
						pingTimer = 0
						client.users.fetch("196957537537490946").then((user)=> {
							user.send("The second bot needs a reboot !")
						});
					} else {
						pingTimer = pingTimer + 1
					}
				} else {
					pingTimer = 99
				}
			} else { console.log("[WARN] Second bot not booted")}
	})
});
marcoTime.start();

client.login(token);