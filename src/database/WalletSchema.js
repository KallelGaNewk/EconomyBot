const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    balance: { type: Number, required: true },
    lastRedeem: { type: Number, required: false },
  },
  { collection: 'wallets' },
);

WalletSchema.index({ user_id: 1 }, { unique: true });

const model = mongoose.model('Wallets', WalletSchema);
module.exports = model;
