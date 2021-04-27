const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');
const WalletSchema = require('../database/WalletSchema')

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
	let balance = 0
	let userWallet = await WalletSchema.find({user_id: message.author.id}).lean()

	if (!userWallet.length) {
		await WalletSchema.create({ user_id: message.author.id, balance: balance})
	} else {
		userWallet = userWallet[0]

		if (!userWallet.balance || userWallet.balance < 0) {
			await WalletSchema.findOneAndUpdate({user_id: message.author.id}, {balance: balance})
		} else {
			balance = userWallet.balance
		}
	}

	const embed = new MessageEmbed()
		.setTitle('Your balance')
		.setDescription(`**\`$${balance}\`**`)
		.setColor(config.color)
		.setFooter(message.author.tag, message.author.displayAvatarURL(config.imagecfg));

	message.channel.send(embed);
}