const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const Subscriber = mongoose.model('User', userSchema);
module.exports = Subscriber;