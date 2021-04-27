const config = require('../config/config.js');
const Utils = require('../Utils.js');
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
    let balance = getUserBalance(message.author.id);

    console.log(balance)

    if (balance === undefined) {
      console.log(balance);
      balance = createUserWallet(user.id, 0);
    }

    const userToTransfer =
      message.mentions.users.first() || client.users.cache.get(args[0]);
    const amountToTransfer = parseInt(args[1]);

    if (!userToTransfer || !amountToTransfer) {
      return Utils.createDefaultEmbed(
        message,
        `Command usage: \`${config.prefix}transfer <@user> <amount>\``,
      );
    }

    const userToTransferBalance = await getUserBalance(userToTransfer.id);

    console.log(userToTransferBalance)

    if (userToTransferBalance === undefined) {
      return Utils.createDefaultEmbed(
        message,
        `This user is not registered, ask them to do \`${config.prefix}balance\``,
      );
    }

    if (balance < amountToTransfer) {
      return Utils.createDefaultEmbed(
        message,
        `You don't have that amount. Your balance: **\`$${balance}\`**`,
      );
    }

    setUserBalance(message.author.id, balance - amountToTransfer);
    setUserBalance(
      userToTransfer.id,
      userToTransferBalance + amountToTransfer,
    );

    Utils.createDefaultEmbed(
      message,
      `Success!\n- **\`$${amountToTransfer}\`**`,
    );
  },
};
