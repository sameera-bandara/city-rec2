const mongoose = require('mongoose');

const mongoURI = "mongodb://mongodb:27017/city-rec-2";


const connect = () => {
  mongoose.connect(mongoURI, { useNewUrlParser: true });
}

module.exports = connect;
