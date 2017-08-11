const mongoose = require("mongoose");

const blogPostSchema = mongoose.Schema({
    uid: String,
    title: String,
    content: String,
    author: {
        firstName: String,
        lastName: String
    },
    created: String
});

blogPostSchema.virtual("name").get(function(){
    var string = this.author.firstName + " " + this.author.lastName
    return string;
});

blogPostSchema.methods.apiRepr = function() {
    return {
        uid: this.uid,
        title: this.title,
        content: this.content,
        author: this.name,
        created: this.created
    }
}

const blogPost = mongoose.model("blogPost", blogPostSchema);

module.exports = {blogPost};