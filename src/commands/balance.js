const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');
const { getUserWallet } = require('../utils/walletUtils');

module.exports = {
  name: 'balance',
  description: 'See you balance',
  aliases: ['bal'],
  usage: '',
  cooldown: 5,
  guildOnly: false,
  permission: '*',
  async execute(client, message, args) {
    const userID = message.author.id;
    let userWallet = await getUserWallet(userID);
    
    const embed = new MessageEmbed()
      .setTitle('Your balance')
      .setDescription(`**\`$${userWallet.balance}\`**`)
      .setColor(config.color)
      .setFooter(
        message.author.tag,
        message.author.displayAvatarURL(config.imagecfg),
      );

    message.channel.send(embed);
  },
};
