const Discord= require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Creates a big whitespace in the chat')
        .addIntegerOption(option=>
            option.setName('rows')
                .setDescription('The number of rows you want to print (default 50 rows)')
                .setRequired(false)),
    status : "+",
    async execute(interaction) {
        let num = interaction.options.getInteger('rows');
        if (num < 1 && num != null){
            await interaction.reply({content:'Value must be above 1', ephemeral:true})
            return 1
        } else if ( num > 150 ){
            await interaction.reply({content: 'Value given is too big (must be 150 or less)', ephemeral : true})
            return 1
        } else if (num == undefined || num == null) {
            num = 50
        }
        var msg = ""
        for (var i = 0; i < num; i++ ){
            msg = msg + ("ㅤ\n");
        }
        await interaction.reply({content: `Clearing **${num}** rows ... ${msg}`})
    }
}