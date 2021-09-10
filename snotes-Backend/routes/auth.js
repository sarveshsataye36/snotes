const express = require("express");
const routers = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { check } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRETE = "SArvVEshs14789";
// create a user using post request :api/auth/createuser .It doesnot required authntiction

routers.post(
  "/createuser",
  [   
    // inserting check validation in array to check login error 
    body("userEmail", "username atleast contain two caracter").isEmail(),
    body("userName", "username atleast contain two caracter").isLength({
      min: 2,
    }),
    body("userPassword", "username atleast contain 8 caracter").isLength({
      min: 8,
    }),
    check(
      "userPassword",
      "The password must be 5+ chars long and contain a number"
    )
      .not()
      .isIn(["123", "userPassword", "god"])
      .withMessage("Do not use a common word as the password")
      .isLength({ min: 5 })
      .matches(/\d/),
  ],
  async (req, res) => {
    // if there are errosr returs the bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
      // cheecking email already exist
      let user = await User.findOne({ userEmail: req.body.userEmail });
      if (user) {
        return res
          .status(400)
          .json({ error: "user with this email already exits" });
      }
        // creating salt passwrod hashing
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.userPassword, salt);

          // creating new user
      user = await User.create({
        userName: req.body.userName,
        userPassword: secPass,
        userEmail: req.body.userEmail
      });

    // adding tokens in through web tokens

      const data = {
        user:{
          id:user.id
        }
      }
      const authToken = jwt.sign(data,JWT_SECRETE);
      res.json(authToken)

      // res.send(req.body);


    }
  catch(error){
      console.error(error.message);
      res.status(500).send("error occured");
  }
  });

// create a user using post request :api/auth/login .It does not required login

routers.post(
  "/login",
  [   
    // inserting check validation in array to check login error 
    body("userEmail", "username atleast contain two caracter").isEmail(),
    body("userPassword", "username atleast contain 8 caracter").isLength({
      min: 8,
    }),
    check(
      "userPassword",
      "The password must be 5+ chars long and contain a number"
    ).exists()
      .not()
      .isIn(["123", "userPassword", "god"])
      .withMessage("Do not use a common word as the password")
      .isLength({ min: 5 })
      .matches(/\d/),
  ],
  async (req, res) => {

       // if there are errors in login returs the bad request.
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array()})
       }

       // destructing the emil nd password 
       const {userEmail ,userPassword} =req.body;
       try {
         // check the email..
         let user = await User.findOne({userEmail});
         if(!user){
         return res.status(400).json({ errors: "please check the email or password"})
         }
         // comparing the password
         const comparePassword = await bcrypt.compare(userPassword, user.userPassword)

         if(!comparePassword){
          return res.status(400).json({ errors: "please check the email or password"})
         }
         const data = {
          user:{
            id:user.id
          }
        }
        const authToken = jwt.sign(data,JWT_SECRETE);
        res.json(authToken);

       } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
       }

  });
  
module.exports = routers;
