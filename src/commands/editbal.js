const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');
const db = require('quick.db');

module.exports = {
  name: 'editbal',
  description: 'See you balance',
  aliases: [],
  usage: '',
  cooldown: 5,
  guildOnly: false,
  permission: '*',
}

module.exports.execute = async (client, message, args) => {
  if (message.author.id !== '356634817544323084') return message.channel.send(':x: **You don\'t have permission');

  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

  let balance = await db.get(`user_${user.id}.balance`);
  if (!balance || balance < 0) {
		await db.set(`user_${message.author.id}`, { balance: 0 })
		balance = await db.get(`user_${message.author.id}.balance`);
  }

  let newBalance = parseInt(args[1]);
  await db.add(`user_${user.id}.balance`, newBalance);

  balance = await db.get(`user_${user.id}.balance`);

  let embed = new MessageEmbed()
    .setDescription(`New \`${user.tag}\` balance: **\`$${balance}\`**`).setColor(config.color)
    .setFooter(message.author.tag, message.author.displayAvatarURL(config.imagecfg));

  message.channel.send(embed);
}