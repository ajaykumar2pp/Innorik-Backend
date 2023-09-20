const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        interests:[String],
        savedArticles:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Article',
            }
        ],
        date:{type:String,default:Date.now}
       
    },
    { timestamps: true });
module.exports = mongoose.model('User', userSchema);