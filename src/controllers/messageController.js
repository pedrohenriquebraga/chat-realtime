const mongoose = require('mongoose')

require('../models/message.js')

const message = mongoose.model('Message')

module.exports = {
    async index() {
        let messages
        await message.find({}).then((result) => {
            return messages = result
        })
        return messages
    },

    async saveNewMessage(messageObj) {
        await message.create(messageObj)
        return console.log('Mensagem salva com sucesso!!')
    }
}
