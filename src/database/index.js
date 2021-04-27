const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  
  return mongoose.connection;
};
