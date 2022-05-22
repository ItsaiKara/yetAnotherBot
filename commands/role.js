const Discord= require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Gives the role given in argument')
		.addStringOption(option =>
			option.setName('role')
				.setDescription('The role you want to get/remove')
				.setRequired(true)
				.addChoices({name: 'Pegi18', value : 'p18'})
				.addChoices({name: 'ProchaineSoiree', value : 'pc'})
				.addChoices({name: 'help', value : 'h'})),
	status : "+",
	async execute(interaction) {
		const author = interaction.member
		//console.log(interaction.options.get('role'))
		var role = null
		switch (interaction.options.get('role').value){
			case 'h':
				await interaction.reply({content : 'Here is the documentation'})
				/// TODO
				break
			case 'p18':
				role = author.guild.roles.cache.find((role) => {
					return role.id === "360831409348149248"
				})
				if (!author.roles.cache.some(r => r.id === "360831409348149248")) {
					author.roles.add(role)
					await interaction.reply({content : 'Role '+ role.name +' added' , ephemeral : true})
				} else {
					author.roles.remove(role)
					await interaction.reply({content : 'Role '+ role.name +' removed' , ephemeral : true})
				}
				break;
			case 'pc':
				role = author.guild.roles.cache.find((role) => {
					return role.id === "826824454310592562"
				})
				if (!author.roles.cache.some(r => r.id === "826824454310592562")) {
					author.roles.add(role)
					await interaction.reply({content : 'Role '+ role.name +' added' , ephemeral : true})
				} else {
					author.roles.remove(role)
					await interaction.reply({content : 'Role '+ role.name +' removed' , ephemeral : true})
				}
				break;
			default:
				await interaction.reply({content: 'Invalid argument', ephemeral : true})
				break
		}
	}
};