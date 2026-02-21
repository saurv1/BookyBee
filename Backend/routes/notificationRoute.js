const router = require('express').Router();
const { getNotifications, markAsRead, markAllAsRead, markByTypeAsRead } = require('../controllers/notificationController');
const isAuthenticated = require('../middleware/isAutenticated');

router.get('/get', isAuthenticated, getNotifications);
router.put('/read/:id', isAuthenticated, markAsRead);
router.put('/read-all', isAuthenticated, markAllAsRead);
router.put('/read-type/:type', isAuthenticated, markByTypeAsRead);

module.exports = router;
