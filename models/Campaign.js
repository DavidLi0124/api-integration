const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['text', 'voice'] },
  startDate: Date,
  endDate: Date,
  prompts: String,
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Data' }],
});

module.exports = mongoose.model('Campaign', CampaignSchema);

