let messages = document.querySelector("#messages")
messages.scrollBy(0, messages.scrollHeight)

document.querySelector("#username").value = localStorage.getItem('username') || '';

if (Notification.permission !== 'granted') {
    alert('Para receber notificações de novas mensagens permita que o site envie notificações!!')
    Notification.requestPermission()
}

function convertMarkdownToHTML(text) {
    let converter = new showdown.Converter({
        noHeaderId: true,
        headerLevelStart: 6,
        simplifiedAutoLink: true,
        literalMidWordUnderscores: true,
        ghCodeBlocks: false,
        smoothLivePreview: true,
        simpleLineBreaks: true,
        openLinksInNewWindow: true,
        emoji: true
    })
    return converter.makeHtml(text)
}

function newDate() {
    const newDate = new Date();
    let hours = {
        hour: newDate.getHours().toString(),
        minute: newDate.getMinutes().toString(),
        second: newDate.getSeconds().toString(),
    }
    let dayAndMonth = {
        day: newDate.getDate(),
        month: newDate.getMonth() + 1
    }
    hours.hour = hours.hour <= 9 ? '0' + hours.hour : hours.hour
    hours.minute = hours.minute <= 9 ? '0' + hours.minute : hours.minute
    hours.second = hours.second <= 9 ? '0' + hours.second : hours.second

    dayAndMonth.day = dayAndMonth.day <= 9 ? '0' + dayAndMonth.day : dayAndMonth.day
    dayAndMonth.month = dayAndMonth.month <= 9 ? '0' + dayAndMonth.month : dayAndMonth.month

    return `${hours.hour}:${hours.minute}:${hours.second} (${dayAndMonth.day}/${dayAndMonth.month})`
}

async function sendNotification(options) {
    let notify = new Notification(options.title, options.opt)
    if (Notification.permission == 'granted') {
        if (options.link !== '') {
            notify.addEventListener('click', () => {
                notify.close()
                window.focus()
                window.location.href = options.link
            })
        }
    }
}

async function renderMessage(message) {
    messages.innerHTML += `<div class="message"><strong class="name">${message.author}:</strong>${convertMarkdownToHTML(message.message)}<span id="date">${message.hour}</span></div>`;
    messages.scrollBy(0, messages.scrollHeight)
}

async function stripHTML(text) {
    return text.replace(/<.*?>/gim, '').replace(/^#/gim, '\\#')
}

let socket = io("https://chat-realtime2.herokuapp.com/")

socket.on("receivedMessage", async message => {
    renderMessage(message);
    sendNotification({
        opt: {
            body: `Nova mensagem de ${message.author}`,
            icon: '/assets/livechat-icon.png'
        },
        title: 'Live Chat',
        link: 'https://livechat-realtime.herokuapp.com/'
    })
});

socket.on("previousMessage", async messages => {
    document.querySelector('#messages').value = ''
    if (messages.length > 0) {
        for (message of messages) {
            renderMessage(message);
        }
    }
});

document.querySelector("#chat").addEventListener('submit', async event => {
    event.preventDefault();
    let author = await stripHTML(document.querySelector("#username").value);
    let message = await stripHTML(document.querySelector("#sendMessage").value);
    document.querySelector("#sendMessage").value = ''

    if (author.length && message.length) {
        let date = newDate()
        localStorage.setItem('username', author)
        var messageObj = {
            author: author,
            message: message,
            hour: date
        };
    }
    renderMessage(messageObj);
    await socket.emit("sendMessage", messageObj);
});
