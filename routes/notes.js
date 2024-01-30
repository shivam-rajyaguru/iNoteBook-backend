const express = require("express");
const router = express.Router();
const Note = require("../models/note");
const fetchuser = require("../middleware/fetchuser");
const { check, body, validationResult } = require("express-validator");

//Route-1 Get all the note using GET : /api/notes/fetchallnotes . login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const note = await Note.find({ user: req.user.id });
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
const validationNote = [
  check("title", "title is not be empty").notEmpty(),
  body("description", "Description must be atleast 5 character").isLength({
    min: 5,
  }),
];
router.post("/addnotes", fetchuser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, tag } = req.body;

    const note = new Note({
      title,
      description,
      tag,
      user: req.user.id,
    });
    const savedData = await note.save();
    res.status(200).json(savedData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
