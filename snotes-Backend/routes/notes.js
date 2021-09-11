const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const routers = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Routes1: Get all the notes usin get request : /api/notes/fetchallnotes  login required
routers.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });

  res.json(notes);
});

// Routes2: add a new notes using post request : /api/notes/fetchallnotes login required
routers.post(
  "/addnote",
  fetchuser,
  [
    body("title", "title atleast two character ").isLength({ min: 2 }),
    body("description", "description atleast five character ").isLength({
      min: 2,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // if there are errosr returs the bad request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveData = await note.save();
      res.json(saveData);
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);

// Routes3: update the existing note using put request : /api/notes/updatenote/:id login required
routers.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be update and update it.

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send({ error: "Note not found" });
    }
    // Allows upadetion if user ows his notes
    if (note.user.toString() != req.user.id) {
      return res.send(401).send({ error: "Not Allowed" });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ note });
  } 
  catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});
// Routes4: delete the existing note using delete request : /api/notes/deletenote/:id login required
routers.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {

    // Find the note to be delete and delete it.
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send({ error: "Note not found" });
    }

    // Allow deletion if user ons this note
    if (note.user.toString() != req.user.id) {
      return res.send(401).send({ error: "Not Allowed" });
    }
    note = await Note.findByIdAndDelete(req.params.id);

    res.json({ deleted: "notes deleted sucess", note: note });
  } 
  catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});
module.exports = routers;
