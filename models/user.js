
//use mongoose to create usermodel , I want to store name,email,phonenumber 

var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    sub: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);