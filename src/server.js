// Requires do servidor
require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// Iniciando o db
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017/livechat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const messageController = require('./controllers/messageController')

// Define a pasta estática
app.use(express.static('./public/'))

// Ativando o req.body
app.use(express.urlencoded({ extended: true }))

// Apagar mensagens

const date = new Date

if ((date.getHours() >= 11 && date.getDay() >= 30) || messageController.index().length >= 500) {
   messageController.removeTheMessages()
}


// Rotas do app


// Página do Chat
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

// Página do Markdown
app.get('/use-markdown', (req, res) => {
    res.sendFile(__dirname + '/views/use-markdown.html')
})

// Conexão com o socket
io.on('connection', async socket => {
    console.log('Socket conectado: ' + socket.id)

    // Envio das mensagens antigas
    socket.emit("previousMessage", await messageController.index())

    // Envio das novas mensagens
    socket.on('sendMessage', async data => {
        messageController.saveNewMessage(data)
        socket.broadcast.emit("receivedMessage", data)
    })
})


// Ouvi a porta 3000 do servidor
server.listen(process.env.PORT || 3000)
