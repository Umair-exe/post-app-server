const express =require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const config = require('config');
const auth = require('../middlewares/auth');
const { authToken } = require('../middlewares/auth');
const { response } = require('express');

router.post('/registerUser', async (req,res) => {
    try {
        let checkUser = await User.findOne({email: req.body.email});
        if(checkUser) { 
            console.log("exist");
            return res.json({
                 msg:"user already exist",
            }); 
        }
        let user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password,salt);
        await user.save();


        //const newUser = await User.create(user);

        return res.json({
            msg: "User created",
            data: user.name
        })
        
    } catch (error) {

        if(error) {
            return res.status(400).send({
                message: "user not created",
            })
        }
        
    }

})


router.post('/auth',async (req,res) => {
  
 
    let checkUser = await User.findOne({email:req.body.email});
    if(!checkUser) {
        return res.status(400).json({
            msg: "user don't exist",
        })
    }
    
    let checkPass = await bcrypt.compare(req.body.password,checkUser.password);
    if(!checkPass) {
        return res.status(500).json({
            msg: "incorrect password"
        });
    }
    let token = jwt.sign({_id:checkUser._id, name:checkUser.name} ,config.get("jwt-key"));

    return res.status(200).send({
        loggedIn: true,
        token,
    });
    



})

router.post('/google/auth', async (req,res) => {
    const user = await User.findOne({
        email: req.body.email,

    })
   
    if(!user) {
        let newUser = new User();
        newUser.email= req.body.email;
        newUser.googleId = req.body.googleId;
        newUser.avatar = req.body.imageUrl;
        newUser.password = "abc";
        await newUser.save();


        let token = jwt.sign({_id:newUser.googleId, name:newUser.name},config.get("jwt-key"));
        return res.status(200).send(token);
    }
    else {
        user.googleId= req.body.googleId;
        user.avatar = req.body.imageUrl;
        let token = jwt.sign({_id:user.googleId, name:user.name},config.get("jwt-key"));
       

        return res.status(200).send(token);
    }


})


module.exports = router;