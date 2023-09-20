const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the article schema
const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now
    }
    // You can add more fields as needed, such as publication date, author, etc.
},
    { timestamps: true });
module.exports = mongoose.model('Article', articleSchema);