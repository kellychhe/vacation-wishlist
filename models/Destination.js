const mongoose = require('mongoose')

const DestinationSchema = new mongoose.Schema({
    name: String,
    location: String,
    description: String,
    photo: String
})

const Destination = mongoose.model('Destination', DestinationSchema)

module.exports = { Destination }