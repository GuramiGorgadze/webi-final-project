const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profilePicture: {
        type: String,
        default: '/images/profile-picture.png',
    },
});

const Subscriber = mongoose.model('User', userSchema);
module.exports = Subscriber;