const mongoose = require('mongoose');
const postSchema = mongoose.Schema( {
    image:String,
    caption:String

})
const postModel = mongoose.model("posts", postSchema);
module.exports = postModel
