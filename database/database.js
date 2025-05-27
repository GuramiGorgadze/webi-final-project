const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect('mongodb+srv://test:test@blog.xodzihd.mongodb.net/?retryWrites=true&w=majority&appName=Blog', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = {connectDatabase};