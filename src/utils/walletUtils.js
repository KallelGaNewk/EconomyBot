const walletSchema = require('../database/WalletSchema');

const createUserWallet = (user_id, initialBalance) =>
  new Promise(async (resolve) => {
    const balance = initialBalance >= 0 ? initialBalance : 0;

    const newUserWallet = await walletSchema.create({
      user_id,
      balance,
    });

    resolve(newUserWallet);
  });

const getUserWallet = (user_id) =>
  new Promise(async (resolve) => {
    try {
      let userWallet = await walletSchema.findOne({ user_id }).lean();
      if (userWallet === null) {
        userWallet = await createUserWallet(user_id, 0);
      }
      resolve(userWallet);
    } catch (_) {
      resolve();
    }
  });

const setUserWallet = (user_id, key, value) =>
  new Promise(async (resolve) => {
    let newObject = {};
    newObject[key] = value;

    let userWallet = await getUserWallet(user_id);
    await walletSchema.findOneAndUpdate({ user_id }, newObject);
    userWallet = await getUserWallet(user_id);

    resolve(userWallet);
  });

module.exports = {
  schema: walletSchema,
  createUserWallet,
  getUserWallet,
  setUserWallet,
};
