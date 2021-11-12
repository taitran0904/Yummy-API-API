const express = require('express');
const router = express.Router();

const {
  getFriendRequest,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} = require('../controllers/friendRequest');
const auth = require('../middlewares/auth');

router.get('/', auth, getFriendRequest);
router.post('/:receiverId', auth, sendFriendRequest);
router.put('/accept/:requestId', auth, acceptFriendRequest);
router.delete('/decline/:requestId', auth, declineFriendRequest);

module.exports = router;
