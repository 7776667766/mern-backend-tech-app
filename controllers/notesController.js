const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')

const User = require('../models/User')


const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()

    // If no notes 
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        try {
          // Use the "username" field as the reference to find the user in the "User" model
          const user = await User.findOne({ _id: note.user }).lean().exec();
      
          // Ensure the user is not null before accessing the username to avoid errors
          const username = user ? user.username : null;
      
          // Create a new object with the "note" data along with the "username" value
          return { ...note, username };
        } catch (error) {
          // Handle any errors that might occur during the process
          console.error('Error populating username:', error);
          return { ...note, username: null }; // Set username to null in case of an error
        }
      }));
      
      res.json(notesWithUser);
      
    
})




const createNewNote = asyncHandler(async (req, res) => {

    const { user, title ,text} = req.body

    if ( !user || !title || !text ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await Note.findOne({ user }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

   
    const note = await Note.create({ user,title,text})

    if (note) {  
        res.status(201).json({ message: `New Note created` })
    } else {
        res.status(400).json({ message: 'Invalid note data received' })
    }
})


const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exists to update
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec()

    // Allow renaming of the original note 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' updated`)
})

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    // Confirm note exists to delete 
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Note '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})








module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
    
}