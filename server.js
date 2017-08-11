// Main pointers
const express = require("express");
const app = express();

const morgan = require("morgan");
app.use(morgan("common"));

const mongoose = require("mongoose");

const {DATABASE_URL, PORT} = require("./config");

// Routes
const blogRouter = require("./routes/blogRouter");

// Server logic
const cDate = new Date();

app.use("/blog-posts", blogRouter);

let server;

function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, err => {
            if (err) {
                return reject(err);
            }
            else {
                server = app.listen(PORT, () => {
                    console.log("App running");
                    resolve();
                }).on("error", err => {
                    reject(err);
                });
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log("Server closing");
            server.close(err => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    });
}

if(require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};

