const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const uuidv4 = require("uuid/v4");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const {blogPost} = require("../models")

router.get("/", jsonParser, (req, res) => {
    blogPost.find().exec().then(posts => {
        res.json({
            posts: posts.map((post) => post.apiRepr())
        });
    });
});

router.get("/:id", jsonParser, (req, res) => {
    blogPost.findOne(req.params.id).exec().then(restaurant => {
        res.json({
            restaurant: restaurant.apiRepr()
        })
    });
});

router.post("/", jsonParser, (req, res) => {
    const requiredFields = ["title", "content", "author"];
    requiredFields.forEach(function(field){
        if(!(field in req.body)) {
            return res.status(400).send(`Field ${field} is missing from the request object.`);            
        }
        else {
            
        }
    });

    var newPost = blogPost.create({
        uid: uuidv4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });

    return res.status(201).json(newPost.apiRepr());
});

router.put("/:id", jsonParser, (req, res) => {
    if(req.params.id != req.body.uid) {
        return res.status(400).send("Parameter ID does not match body ID.");
    }

    const updated = {};
    const updateableFields = ['title', 'content', 'author'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    blogPost.findOneAndUpdate({uid: req.params.uid}, {$set: updated}, {new: true}).exec().then(updatedPost => 
    res.status(201)
    .json(updatedPost.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

router.delete("/:id", jsonParser, (req, res) => {
    blogPost
    .findOneAndRemove({uid: req.params.uid})
    .exec()
    .then(() => {
        console.log(`Deleted blog post with id \`${req.params.uid}\``);
        res.status(204).end();
    });
});


module.exports = router;