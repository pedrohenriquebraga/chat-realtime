const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const newDate = new Date()

let messages = []

if (newDate.getDate() % 15 == 0 || messages.length >= 500) {
    for (message in messages) {
        messages.pop()
        if (messages.length == 0) {
            break
        }
    }
}

app.use(express.static(__dirname + '/public/'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
    console.log('Socket conectado: ' + socket.id)

    socket.emit("previousMessage", messages)
    socket.on('sendMessage', data => {
        messages.push(data)
        socket.broadcast.emit("receivedMessage", data)
    })
})

server.listen(process.env.PORT || 3000)
