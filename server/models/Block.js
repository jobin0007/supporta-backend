const mongoose = require('mongoose')
const blockSchema = new mongoose.Schema({
    blocker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    blocked: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  module.exports = mongoose.model('Block', blockSchema);