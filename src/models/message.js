const mongoose = require('mongoose')

// Criando o esquema do DB
const MessageSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}) 

mongoose.model('Message', MessageSchema)