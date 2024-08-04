const user = require('../controller/user');
const express = require('express');
const router = express.Router();

//route for set user
router.post('/setUser', user.setUser);
router.get('/getUser', user.getUser);
router.get('/getAllUsers', user.getAllUsers);



module.exports = router;