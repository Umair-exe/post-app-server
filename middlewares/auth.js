const config  = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    authToken: async (req,res,next) => {
        let token = req.header("x-auth-token");
        if(!token) return res.status(400).json("token is not provided");
        let verify = await jwt.verify(token, config.get("jwt-key"))
        if(verify) {
            req.user = await User.findById(verify._id)
        }
        next();
    }
}