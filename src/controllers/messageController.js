const mongoose = require('mongoose')
const showdown = require('showdown')

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
        let converter = new showdown.Converter({
            noHeaderId: true,
            headerLevelStart: 6,
            simplifiedAutoLink: true,
            literalMidWordUnderscores: true,
            ghCodeBlocks: true,
            smoothLivePreview: true,
            simpleLineBreaks: true,
            openLinksInNewWindow: true,
            emoji: true
        })
    
        messageObj.message = messageObj.message.replace(/<.*?>/gim, '').replace(/^#/gim, '\\#')
        messageObj.message = await converter.makeHtml(messageObj.message)

        await message.create(messageObj)
        return console.log('Mensagem salva com sucesso!!')
    },

    async removeTheMessages() {
        await message.remove({})
    }
}
