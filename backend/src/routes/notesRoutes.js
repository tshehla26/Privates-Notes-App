
const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
    createNote,
    getNotes,
    updateNote,
    deleteNote
} = require("../controllers/notesController");

// GET all notes
router.get("/", authenticateUser, getNotes);

// CREATE a note
router.post("/", authenticateUser, createNote);

// UPDATE a note
router.put("/:id", authenticateUser, updateNote);

// DELETE a note
router.delete("/:id", authenticateUser, deleteNote);

module.exports = router;
