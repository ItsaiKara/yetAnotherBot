// Require the necessary discord.js classes
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Discord.Collection();


/****************************************************************
	The part where modules (commands are loaded)
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

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('[INFO] Client ready');
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


client.login(token);