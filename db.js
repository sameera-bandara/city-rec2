const mongoose = require('mongoose');

const mongoURI = "mongodb://mongo:27017/CityRec3";


const connect = () => {
  mongoose.connect(mongoURI, { useNewUrlParser: true });
}

module.exports = connect;
