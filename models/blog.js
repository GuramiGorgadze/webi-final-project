const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    id: String,
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorPicture: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    replies: [{
        content: String,
        author: String,
        authorPicture: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    likes: [String]
});

const blogSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    content: String,
    author: String,
    picture: String,
    date: String,
    formatedDate: String,
    comments: [commentSchema],
});

module.exports = mongoose.model('Blog', blogSchema);
