const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');
const Utils = require('../Utils.js');
const db = require('quick.db');

module.exports = {
  name: 'transfer',
  description: 'Transfer money to other user',
  aliases: ['trans'],
  usage: '<@user> <amount>',
  cooldown: 5,
  guildOnly: false,
  permission: '*',
}

module.exports.execute = async (client, message, args) => {
  const balance = await db.get(`user_${message.author.id}.balance`);
  if (!balance || balance < 0) {
    return Utils.createDefaultEmbed(message, `You not is registered, do \`${config.prefix}balance\``);
  }

  const userToTransfer = message.mentions.users.first() || client.users.cache.get(args[0]);
  const amountToTransfer = parseInt(args[1]);
  const userToTransferBalance = await db.get(`user_${userToTransfer.id}.balance`);

  if (!userToTransferBalance || userToTransferBalance < 0) {
    return Utils.createDefaultEmbed(message, `This user is not registered, ask them to do \`${config.prefix}balance\``);
  }

  if(balance < amountToTransfer)  {
    return Utils.createDefaultEmbed(message, `You don't have that amount. Your balance: **\`$${balance}\`**`);
  } else {
    await db.subtract(`user_${message.author.id}.balance`, amountToTransfer);
    await db.add(`user_${userToTransfer.id}.balance`, amountToTransfer)
    Utils.createDefaultEmbed(message, `Success!\n- **\`$${amountToTransfer}\`**`)
  }
}