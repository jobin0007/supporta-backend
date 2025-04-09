const express = require('express');
const blockController = require('../controllers/blockController');
const authenticate = require('../middleware/authenticator');

const blockRoutes = express.Router();

blockRoutes.post('/block-user/:userId', authenticate, blockController.blockUser);
blockRoutes.post('/unblock-user/:userId', authenticate, blockController.unblockUser);

module.exports = blockRoutes;