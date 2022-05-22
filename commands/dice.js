const Discord= require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Roll a dice')
		.addIntegerOption(option=>
			option.setName('size')
				.setDescription('Size of the dice you want to roll')
				.setRequired(true)),
	status : "+",
	async execute(interaction) {
		//console.log(interaction)
		let num = interaction.options.getInteger('size');
		//console.log(num)
		if (num <= 1 ){
			await interaction.reply({content : 'Please select a number above 1', ephemeral: true})
		} else {
			out = Math.floor(Math.random() * num) + 1
			await interaction.reply('You rolled: **' + out.toString() + '** on a d'+num)
		}
	},

};