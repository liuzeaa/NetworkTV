var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = Schema({
    nickName:String,
    content:String,
    createdAt: {type: Date, default: Date.now },
    updatedAt:Date,
    isDelected:{type:Boolean,default:false}
})

var Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;
