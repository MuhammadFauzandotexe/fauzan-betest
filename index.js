const express = require('express');
const mongoose = require('mongoose');
const { request, response } = require("express");
const router = require('./router/userRouter');
const app = express();
const redis = require('./middleware/redisClient')

//Todo===============================================================
mongoose.connect('mongodb://mongo:27017/db_fauzan_betest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connection successfully: mongodb');
});
var myLogger = function (req,res,next){
    next()
}
app.use(myLogger)
app.use(express.json());
// app.use(router)
app.listen(3001, function () {
    console.log('Server iss running on port 3000');
});
