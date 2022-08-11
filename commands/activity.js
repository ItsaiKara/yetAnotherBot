const Discord= require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

function calculateScore(id, arr){
    var ttl = 0
    ttl = arr["msg"] + arr["feur"] + arr["voc"]/2
    return ttl
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Displays the most active users')
        .addIntegerOption(option=>
            option.setName('number')
                .setDescription('The max amount of people to see in the top (default:10)')
                .setRequired(false)),
    status : "+",
    async execute(interaction) {
        // Firts part handles the argument
        let num = interaction.options.getInteger('number');
        if (num < 1 && num != null){
            await interaction.reply({content:'Value must be above 1', ephemeral:true})
            return 1
        } else if ( num > 30 ){
            await interaction.reply({content: 'Value given is too big (must be 30 or less)', ephemeral : true})
            return 1
        } else if (num == undefined || num == null) {
            num = 10
        }
        //For each user we must calculate their score
        var jsonUserActivity = require('../userData.json');
        orderedObj = []
        for(element in jsonUserActivity){
            var score = calculateScore(element, jsonUserActivity[element])
            orderedObj.push({'id' : element, 'score': score})
            
        }
        orderedObj.sort((a, b) => a.score - b.score) //sorted array
        orderedObj.reverse()
        console.log(orderedObj)

        var finalString = ""
        var ct = 0
        for (const iterator of orderedObj) {
            ct++
            const userd = await interaction.client.users.fetch(iterator.id).catch(console.error);
            finalString = finalString + "ㅤㅤ" + ct +": **" + userd.username + "**#" + userd.discriminator +":\n" + "ㅤㅤㅤㅤTotal score:** "+ parseInt(iterator.score) + "** \n"
            if (ct == num) { 
                await interaction.reply({content: `Displaying top ${num} of active users \n ${finalString}`})
                return 0
            }
        }
        await interaction.reply({content: `Displaying top ${num} of active users \n ${finalString}`})
    }
}