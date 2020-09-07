const mongoose = require('mongoose')
const showdown = require('showdown')

require('../models/message.js')

const message = mongoose.model('Message')

module.exports = {
    async index() {
        let messages
        await message.find({}).then( result => messages = result ).catch( err => console.error(err) )
        return messages
    },

    async saveNewMessage(messageObj) {
        await message.create(messageObj)
    },

    async removeTheMessages() {
        await message.deleteMany({})
    }
}
