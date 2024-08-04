const User = require('../models/user');
const formatApiResponse = require('../utility/response');
const AWS = require('aws-sdk');

function setUser(req, res) {
    // Get the user data from the request body
    console.log("Coming here Controller");

    console.log(req);
    const newUser = new User(
        {
            name: req.user.name,
            email: req.user.email,
            sub: req.user.sub
        }
    );

    console.log(newUser);   ``

    newUser.save()
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((err) => {
            res.status(500).send('Failed to save the user');
        });
}

//get user

async function getUser(req, res) {
    try {
        const users = await User.findOne({ sub: req.user.sub });
        console.log(users);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send('Failed to get the users');
    }
}

//get All Users except the current user

async function getAllUsers(req, res) {
    try {
        const users = await User.find({ sub: { $ne: req.user.sub } });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send('Failed to get the users');
    }
}


module.exports = {
    setUser,
    getUser,
    getAllUsers
};