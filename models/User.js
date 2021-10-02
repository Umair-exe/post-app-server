const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 
    name: {
        type: String
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model("User", UserSchema);