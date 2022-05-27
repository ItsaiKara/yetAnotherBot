const Discord= require('discord.js');
const { blackTags } = require('./blackListTag.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//var parseString = require('xml2js').parseString;
//var DOMParser = require('dom-parser');
var Regex = require("regex");
const axios = require('axios');
const {SlashCommandBuilder} = require("@discordjs/builders");
//const {log} = require("util");
var imgArr = []

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pornme')
		.setDescription('Posts porn from given artist')
		.addStringOption(option =>
		option.setName('artist')
			.setDescription('The artist name')
			.setRequired(false)
			.addChoices(
				{ name: 'kairu', value: 'kairunoburogu' },
				{ name: 'squeezable', value: 'squeezable' },
				{ name: 'dross', value: 'dross' },
			))
		.addStringOption(option =>
		option.setName('tags')
			.setDescription('Get images with specific tags (use the syntax "xxx+yyy+-zzz")')
			.setRequired(false)),
	status : "+",
	async execute(interaction) {
		var artist = interaction.options.get('artist')
		var maxPage = 1 
		if (artist != null) {
			switch (maxPage) {
			case 'kairunoburogu':
				maxPage = 2
				break;
			case 'squeezable':
				maxPage = 7
				break;
			case 'dross':
				maxPage = 8
				break;
			default:
				maxPage = 100
			}
			artist = artist.value
		}
		if (artist == null) { 
			if (interaction.options.get('tags') != null) {
				maxPage = 3
			}
			artist = blackTags
		}
		if (interaction.options.get('tags') != null) {
			//console.log(interaction.options.get('tags').value)
			//console.log(artist)
			var leTag = interaction.options.get('tags').value
			//artist = artist + "+"
			console.log("ok")
			//artist = artist + leTag
			console.log("ok")
			artist = leTag + "+" + artist
	
		}
		var randPage = Math.floor(Math.random() * maxPage)
		//console.log(artist)
		console.log(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${artist}&limit=100&pid=${randPage}`)
		axios
			.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${artist}&limit=100&pid=${randPage}`)
			.then(res => {
				//console.log("ok")
				//console.log(`statusCode: ${res.status}`);
				//console.log(res);
				var regex = /file_url="https:\/\/api-cdn\.rule34\.xxx\/images\/[0-9]*\/[a-z0-9]*\.[a-z0-9]*"/g
				var arrLinks = res.data.match(regex)
				var img = arrLinks[Math.floor(Math.random() * arrLinks.length)]
				img = img.slice(10)
				img = img.slice(0, -1)
				if (interaction.channel.nsfw){
					interaction.reply(`${img}`)
				} else {
					/*
					interaction.reply({
						files: [{
							attachment: img,
							name: "SPOILER_IMG.jpg"
						}]
					})
					*/	
					interaction.reply(`||${img}||`)			
				}
			})
			.catch(error => {
			console.error(error);
			});
			
		}
	}