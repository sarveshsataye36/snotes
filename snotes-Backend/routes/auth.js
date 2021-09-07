const express = require('express');
const routers = express.Router();
const User = require('../models/User');
// create a user using post request :api/auth .It doesnot required authntiction

routers.get('/',(req, res)=>{

    console.log(req.body);
    const user = User(req.body);
    user.save();
    res.send(req.body);
})

module.exports = routers;