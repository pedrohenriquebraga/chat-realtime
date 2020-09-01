let messages = $("#messages")
messages.prop('scrollTop', messages.prop('scrollHeight'))

let socket = io("https://livechat-realtime.herokuapp.com/");


function sendNotification(options) {
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

function renderMessage(message) {

    let converter = new showdown.Converter({
        noHeaderId: true,
        headerLevelStart: 6,
        simplifiedAutoLink: true,
        literalMidWordUnderscores: true,
        ghCodeBlocks: false,
        smoothLivePreview: true,
        simpleLineBreaks: false,
        openLinksInNewWindow: true,
        emoji: true
    })

    message.message = await converter.makeHtml(message.message)

    messages.append(`<div class="message"><strong class="name">${message.author}</strong>${message.message}<span id="date">${message.hour}</span></div>`);

    messages.prop('scrollTop', messages.prop('scrollHeight'))

}
function stripHTML(text) {
    return text.replace(/<.*?>/gim, '').replace(/^#/gim, '\\#')
}

socket.on("receivedMessage", (message) => {
    renderMessage(message);
});

socket.on("previousMessage", (messages) => {
    $('#messages').text('')
    if (messages.length > 0) {
        for (message of messages) {
            renderMessage(message);
        }
    }


});

$("#chat").submit(function (event) {
    event.preventDefault();

    let author = stripHTML($("#username").val());
    let message = stripHTML($("#sendMessage").val());
    $("#sendMessage").val("");

    if (author.length && message.length) {

        let date = newDate()

        var messageObj = {
            author: author,
            message: message,
            hour: date
        };
    }
    renderMessage(messageObj);
    socket.emit("sendMessage", messageObj);
});
