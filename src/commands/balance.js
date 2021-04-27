const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');
const { getUserBalance, createUserWallet } = require('../utils/walletUtils');

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
    let balance = await getUserBalance(userID);

    if (balance === undefined) {
      balance = (await createUserWallet(userID, 0)).balance;
    }

    const embed = new MessageEmbed()
      .setTitle('Your balance')
      .setDescription(`**\`$${balance}\`**`)
      .setColor(config.color)
      .setFooter(
        message.author.tag,
        message.author.displayAvatarURL(config.imagecfg),
      );

    message.channel.send(embed);
  },
};
