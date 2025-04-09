const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);