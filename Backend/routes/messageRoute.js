const router = require('express').Router();
const { sendMessage, getMessages, getChatList } = require('../controllers/messageController');
const isAuthenticated = require('../middleware/isAutenticated');

router.post('/send', isAuthenticated, sendMessage);
router.get('/get/:userId', isAuthenticated, getMessages);
router.get('/list', isAuthenticated, getChatList);

module.exports = router;
