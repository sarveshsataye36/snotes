const express = require('express');
const routers = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { check } = require('express-validator');
// create a user using post request :api/auth .It doesnot required authntiction

routers.post('/',[
    body('userEmail').isEmail(),
    body('userName','username atleast contain two caracter').isLength({ min: 2 }),
    check('userPassword', 'The password must be 5+ chars long and contain a number')
    .not()
    .isIn(['123', 'userPassword', 'god'])
    .withMessage('Do not use a common word as the password')
    .isLength({ min: 5 })
    .matches(/\d/)
],(req, res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
        userName: req.body.userName,
        userPassword: req.body.userPassword,
        userEmail: req.body.userEmail,
      }).then(user => res.json(user))
      .catch(err=>{console.log(err),
      res.json({errors :'Please enter unique details'})});
    

    res.send(req.body);
})

module.exports = routers;