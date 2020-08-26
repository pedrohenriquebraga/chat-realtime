const mongoose = require('mongoose')
const markdown = require('markdown').markdown
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
        messageObj.message = markdown.toHTML(messageObj.message)
        await message.create(messageObj)
        return console.log('Mensagem salva com sucesso!!')
    }
}
