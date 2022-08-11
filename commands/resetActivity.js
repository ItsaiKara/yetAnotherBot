const Discord= require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetactivity')
        .setDescription('[ADMIN] resets the activity of users (flushes the whole file)'),
    status : "+",
    async execute(interaction) {
        if(interaction.member.id == '196957537537490946') {
            await interaction.reply({content: `Flushing the terlet`})
            var jsonStr = JSON.stringify({});
            fs.writeFile('userData.json', jsonStr, (err) => {
                if (err) {
                    //throw err;
                }
                console.log("[INFO] JSON user has been erased");
            });
        } else {
            await interaction.reply({content: "https://i.kym-cdn.com/photos/images/newsfeed/001/483/348/bdd.jpg"})
        }
        
    }
}