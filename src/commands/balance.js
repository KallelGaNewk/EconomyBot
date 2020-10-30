const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');
const db = require('quick.db');

module.exports = {
	name: 'balance',
	description: 'See you balance',
	aliases: ['bal'],
	usage: '',
	cooldown: 5,
	guildOnly: false,
	permission: '*',
}

module.exports.execute = async (client, message, args) => {
  let balance = await db.get(`user_${message.author.id}.balance`);
  if (!balance || balance < 0) {
		await db.set(`user_${message.author.id}`, { balance: 0 })
		balance = await db.get(`user_${message.author.id}.balance`);
  }

	const embed = new MessageEmbed()
		.setTitle('Your balance')
		.setDescription(`**\`$${balance}\`**`)
		.setColor(config.color)
		.setFooter(message.author.tag, message.author.displayAvatarURL(config.imagecfg));

	message.channel.send(embed);
}