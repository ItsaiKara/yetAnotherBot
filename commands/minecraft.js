const Discord= require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Get informations about the minecraft server'),
    status : "*",
    async execute(interaction, mcip) {
        if (mcip == "null"){
            await (interaction.reply({content : "There is no minecraft server running for the USCC"}))
        } else {
            await (interaction.reply({content: "There is a server running for the USCC, IP:** " + mcip + "**"}))
        }
    },
};