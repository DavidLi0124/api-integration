const mongoose = require('mongoose');

const CRMSchema = new mongoose.Schema({
  status: { type: String, enum: ['DA', 'Follow Up', 'NU'], default: 'Follow Up' },
  interactions: [{
    date: Date,
    details: String,
    textMessages: [String],
    voiceSummary: String,
  }],
});

module.exports = mongoose.model('CRM', CRMSchema);



