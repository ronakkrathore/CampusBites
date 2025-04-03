const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
    type: String,
    unique: true, 
    lowercase: true,
    trim: true
    },
    phone_no: {
    type: String,   
    required: true,
    unique: true
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
