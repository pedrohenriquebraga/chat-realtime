const mongoose = require('mongoose')
require('../models/message.js')

const message = mongoose.model('Message')

module.exports = {
    async index() {
        let messages
        await message.find({}).limit(150).then((result) => {
            return messages = result
        }).catch(err => console.error(err))

        return messages
    },

    async saveNewMessage(messageObj) {
        await message.create(messageObj)
        return console.log('Mensagem salva com sucesso!!')
    },

    async removeTheMessages() {
        await message.remove()
    }
}
