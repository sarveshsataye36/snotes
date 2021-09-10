const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const routers = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require("express-validator");

// Routes1: Get all the notes usin get request : /api/notes/fetchallnotes  login required
 routers.get('/fetchallnotes',fetchuser, async (req, res)=>{
    const notes = await Note.find({user : req.user.id});

    res.json(notes); 
})

// Routes2: add a new notes using post request : /api/notes/fetchallnotes login required
routers.post('/addnote',fetchuser,[
    body("title", "title atleast two character ").isLength({min: 2}),
    body("description", "description atleast five character ").isLength({min: 2}),
], async (req, res)=>{

    try {
        const {title,description,tag} = req.body;
        
    // if there are errosr returs the bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note({
        title, description, tag, user: req.user.id
    })
    const saveData = await note.save()
    res.json(saveData); 


} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
        
}
})

module.exports = routers;