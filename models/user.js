const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
    userName: String,
    accountNumber: String,
    emailAddress: String,
    identityNumber: String,
},{timestamps:true});

const User = mongoose.model('User',user);
module.exports = User;

