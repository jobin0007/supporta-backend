const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const blockController = {
  blockUser: asyncHandler(async (req, res) => {
    const userId = req.user;
    const { targetUserId } = req.body;

    const user = await User.findById(userId);
    if (!user.blockedUsers.includes(targetUserId)) {
      user.blockedUsers.push(targetUserId);
      await user.save();
    }

    res.json({ message: 'User blocked' });
  }),

  unblockUser: asyncHandler(async (req, res) => {
    const userId = req.user;
    const { targetUserId } = req.body;

    const user = await User.findById(userId);
    user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== targetUserId);
    await user.save();

    res.json({ message: 'User unblocked' });
  }),
};

module.exports = blockController;