const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
});

module.exports = mongoose.model('Data', DataSchema);


