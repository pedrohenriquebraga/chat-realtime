const mongoose = require('mongoose')
require('../models/message.js')

const message = mongoose.model('Message')

module.exports = {
    async index() {
        let messages
        await message.find({}).then((result) => {
            return messages = result
        }).catch(err => console.error(err))

        return messages
    },

    async saveNewMessage(messageObj) {
        await message.create(messageObj)
    },

    async removeTheMessages() {
        await message.remove({}, (err) => {
            if (err) {
                return console.log(err)
            }
        })
    }
}
