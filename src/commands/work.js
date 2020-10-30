const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');
const Utils = require('../Utils.js');
const db = require('quick.db');

module.exports = {
  name: 'work',
  description: 'Work to make money',
  aliases: ['daily'],
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

  let now = Date.now();

  let lastRedeem = await db.get(`user_${message.author.id}.lastRedeem`);
  if (!lastRedeem) lastRedeem = await db.set(`user_${message.author.id}.lastRedeem`, now);

  if (now - parseInt(lastRedeem) < 86400000) {
    let embed = new MessageEmbed()
      .setDescription('Have you worked today!').setColor(config.color)
      .setFooter(message.author.tag, message.author.displayAvatarURL(config.imagecfg));

    message.channel.send(embed);
  } else {
    const moneyToAdd = Utils.randomIntFromInterval(500, 1000);

    await db.set(`user_${message.author.id}.lastRedeem`, now);
    await db.add(`user_${message.author.id}.balance`, moneyToAdd);

    let embed = new MessageEmbed()
    .setTitle('You worked!')
    .setDescription(`+ **\`$${moneyToAdd}\`**`).setColor(config.color)
    .setFooter(message.author.tag, message.author.displayAvatarURL(config.imagecfg));

    message.channel.send(embed);
  }
}

