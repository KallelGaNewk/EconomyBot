const config = require('../config/config.js');
const Utils = require('../utils');
const { getUserBalance, setUserBalance } = require('../utils/walletUtils.js');

module.exports = {
  name: 'transfer',
  description: 'Transfer money to other user',
  aliases: ['trans'],
  usage: '<@user> <amount>',
  cooldown: 5,
  guildOnly: false,
  permission: '*',
  async execute(client, message, args) {
    let userWallet = await getUserWallet(message.author.id);

    const userToTransfer =
      message.mentions.users.first() || client.users.cache.get(args[0]);
    const amountToTransfer = parseInt(args[1]);

    if (!userToTransfer || !amountToTransfer) {
      return Utils.createDefaultEmbed(
        message,
        `Command usage: \`${config.prefix}transfer <@user> <amount>\``,
      );
    }

    const userToTransferWallet = await getUserWallet(userToTransfer.id);

    if (userWallet.balance < amountToTransfer) {
      return Utils.createDefaultEmbed(
        message,
        `You don't have that amount. Your balance: **\`$${balance}\`**`,
      );
    }

    setUserWallet(message.author.id, 'balance', userWallet.balance - amountToTransfer);
    setUserWallet(
      userToTransfer.id,
      'balance',
      userToTransferWallet.balance + amountToTransfer,
    );

    Utils.createDefaultEmbed(
      message,
      `Success!\n- **\`$${amountToTransfer}\`**`,
    );
  },
};
