const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');
const Utils = require('../utils');
const { getUserWallet, schema } = require('../utils/walletUtils.js');

module.exports = {
  name: 'work',
  description: 'Work to make money',
  aliases: ['daily'],
  usage: '',
  cooldown: 5,
  guildOnly: false,
  permission: '*',
  async execute(client, message, args) {
    const now = Date.now();
  
    let { lastRedeem } = getUserWallet(message.author.id);
    if (!lastRedeem) {
      await schema.findOneAndUpdate(
        { user_id: message.author.id },
        { lastRedeem: now },
      );
    }
  
    if (now - parseInt(lastRedeem) < 86400000) {
      let embed = new MessageEmbed()
        .setDescription('Have you worked today!')
        .setColor(config.color)
        .setFooter(
          message.author.tag,
          message.author.displayAvatarURL(config.imagecfg),
        );
  
      message.channel.send(embed);
    } else {
      const moneyToAdd = Utils.randomIntFromInterval(500, 1000);
  
      await schema.findOneAndUpdate(
        { user_id: message.author.id },
        { lastRedeem: now },
      );
      setUserBalance(message.author.id, moneyToAdd + balance);
  
      let embed = new MessageEmbed()
        .setTitle('You worked!')
        .setDescription(`+ **\`$${moneyToAdd}\`**`)
        .setColor(config.color)
        .setFooter(
          message.author.tag,
          message.author.displayAvatarURL(config.imagecfg),
        );
  
      message.channel.send(embed);
    }
  }
};
