const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('Subscriber', subscriberSchema);
module.exports = User;