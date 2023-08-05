const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Replace 'User' with the actual name of your User model
            required: true,
      
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
   
)



module.exports = mongoose.model('Note', noteSchema)