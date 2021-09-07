const express = require('express');
const routers = express.Router();

routers.get('/',(req, res)=>{

    res.json([])
})

module.exports = routers;