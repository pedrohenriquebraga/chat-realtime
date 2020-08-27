// Requires do servidor

require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// Iniciando o db
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://ph:${process.env.MONGODB_PASSWORD}@livechat0.69okr.gcp.mongodb.net/livechat?retryWrites=true&w=majority` || 'mongodb://localhost:27017/livechat', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const messageController = require('./controllers/messageController')

// Define a pasta estática
app.use(express.static('./public/'))

// Apagar mensagens

const date = new Date

if (date.getHours() >= 3 && date.getDay() >= 30) {
    messageController.removeTheMessages()
}


// Rota principal do app
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/use-markdown', (req, res) => {
    res.sendFile(__dirname + '/views/use-markdown.html')
})

// Conexão com o socket
io.on('connection', async socket => {
    console.log('Socket conectado: ' + socket.id)

    // Envio das mensagens antigas
    socket.emit("previousMessage", await messageController.index())

    // Envio das novas mensagens
    socket.on('sendMessage', data => {
        messageController.saveNewMessage(data)
        socket.broadcast.emit("receivedMessage", data)
    })
})


// Ouvi a porta 3000 do servidor
server.listen(process.env.PORT || 3000)
