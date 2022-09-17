const Discord= require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const { minecraft } = require('../config.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Get informations about the minecraft server rented if available'),
    status : "+",
    async execute(interaction) {
        if(minecraft.status == "closed"){
            interaction.reply("At the current time no server is opening anytime soon")
        } else if(minecraft.status == "open"){
            interaction.reply(`Current server: \n ip:${minecraft.ip} \n Server description: ${minecraft.desc}, \n`)
        } else {
            interaction.reply(`${minecraft.desc} \n ${minecraft.date}`)
        }
    },
};