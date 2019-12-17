const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URL;

const connect = () => {
  mongoose.connect(mongoURI, { useNewUrlParser: true });
}

module.exports = connect;
