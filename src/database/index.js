const mongoose = require("mongoose")

module.exports = async () => {
  await mongoose.connect("")
  return mongoose.connection;
}

