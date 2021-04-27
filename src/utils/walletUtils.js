const walletSchema = require('../database/WalletSchema');

const createUserWallet = async (user_id, balance) => {
  const userBalance = balance >= 0 ? balance : 0;

  return await walletSchema.create({
    user_id: user_id,
    balance: userBalance,
  });
};

const getUserWallet = async (user_id) => {
  try {
    let [userWallet] = await walletSchema.find({ user_id: user_id }).lean();
    return userWallet;
  } catch (_) {
    return;
  }
};

const setUserBalance = async (user_id, balance) => {
  const userWallet = getUserWallet(user_id);

  const userBalance = balance >= 0 ? balance : 0;

  if (!userWallet) {
    await createUserWallet(user_id, userBalance);
  } else {
    await walletSchema.findOneAndUpdate(
      { user_id: user_id },
      { balance: userBalance },
    );
  }
};

const getUserBalance = async (user_id) => {
  const userWallet = await getUserWallet(user_id);
  return userWallet.balance;
};

module.exports = {
  createUserWallet,
  getUserWallet,
  setUserBalance,
  getUserBalance,
};
