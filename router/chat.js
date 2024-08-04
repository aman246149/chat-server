
const chat = require('../controller/chat');
const express = require('express');
const router = express.Router();

router.post('/createGroup', chat.createGroup);

router.get('/getGroup', chat.getGroups);

router.get('/getMessages', chat.getMessages);

module.exports = router;