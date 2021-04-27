const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');
const Utils = require('../utils');
const { getUserWallet, setUserWallet } = require('../utils/walletUtils.js');
const moment = require('moment');

module.exports = {
  name: 'work',
  description: 'Work to make money',
  aliases: ['daily'],
  usage: '',
  cooldown: 5,
  guildOnly: false,
  permission: '*',
  async execute(client, message, args) {
    let userWallet = await getUserWallet(message.author.id);
    const now = Date.now();
  
    let { lastRedeem } = await getUserWallet(message.author.id);
    if (!lastRedeem) {
      await setUserWallet(message.author.id, 'lastRedeem', now);
    }
  
    if (now - parseInt(lastRedeem) < 86400000) {
      let embed = new MessageEmbed()
        .setDescription('Have you worked today!')
        .addField('Last redeem', moment(lastRedeem).fromNow())
        .setColor(config.color)
        .setFooter(
          message.author.tag,
          message.author.displayAvatarURL(config.imagecfg),
        );
  
      message.channel.send(embed);
    } else {
      const moneyToAdd = Utils.randomIntFromInterval(500, 1000);
  
      await setUserWallet(message.author.id, 'lastRedeem', now);
      await setUserWallet(message.author.id, 'balance', moneyToAdd + userWallet.balance);
  
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
