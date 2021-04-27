const { MessageEmbed } = require('discord.js');
const { developers } = require('../config/config.js');
const config = require('../config/config');
const { setUserWallet } = require('../utils/walletUtils');

module.exports = {
  name: 'editbal',
  description: 'See you balance',
  aliases: [],
  usage: '',
  cooldown: 5,
  guildOnly: false,
  permission: '*',
  async execute(client, message, args) {
    if (!developers.includes(message.author.id)) {
      return message.channel.send(":x: **You don't have permission**");
    }

    let user =
      message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user) {
      return message.channel.send(":x: **Mention a valid user**");
    }

    let newBalance = parseInt(args[1]);
    newBalance = newBalance < 0 ? 0 : newBalance;

    if (isNaN(newBalance)) {
      return message.channel.send(":x: **Invalid balance**");
    }

    const userWallet = await setUserWallet(user.id, 'balance', newBalance)

    let embed = new MessageEmbed()
      .setDescription(`New \`${user.tag}\` balance: **\`$${userWallet.balance}\`**`)
      .setColor(config.color)
      .setFooter(
        message.author.tag,
        message.author.displayAvatarURL(config.imagecfg),
      );

    message.channel.send(embed);
  },
};
