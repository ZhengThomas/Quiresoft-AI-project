const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    email: {
        required: true, 
        type: String
    },
    pass: {
        required: true, 
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)