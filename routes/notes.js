const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middleware/fetchuser');

// ROUTE 1: Get All the notes using: GET "/notes/getallnotes". No Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server Error")
    }
})

// ROUTE 2: Post Add a new note using: POST "/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atlest 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    try {


        const { title, description, tag } = req.body;

        // If there are errors return basd Request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNotes = await note.save();

        res.json(saveNotes);
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server Error")
    }
})

module.exports = router;