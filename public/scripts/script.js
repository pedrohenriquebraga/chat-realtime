let socket = io("https://livechat-realtime.herokuapp.com/");
function renderMessage(message) {
    $("#messages").append(
        `<div class="message"><strong class="name">${message.author}</strong>${message.message}<span id="date">${message.hour}</span></div>`
    );
    document.querySelector("#sendMessage").value = "";
}

socket.on("receivedMessage", (message) => {
    renderMessage(message);
});

socket.on("previousMessage", (messages) => {
    $("#messages").text('')
    for (message of messages) {
        renderMessage(message);
    }
});

$("#chat").submit(function (event) {
    event.preventDefault();

    let author = $("#username").val();
    let message = $("#sendMessage").val();

    if (author.length && message.length) {
        const newDate = new Date();
        let hours = {
            hour: newDate.getHours().toString(),
            minute: newDate.getMinutes().toString(),
            second: newDate.getSeconds().toString(),
        }

        let dayAndMonth = {
            day: newDate.getDate(),
            month: newDate.getMonth()+1
        }

        hours.hour = hours.hour <= 9 ? '0' + hours.hour : hours.hour
        hours.minute = hours.minute <= 9 ? '0' + hours.minute : hours.minute
        hours.second = hours.second <= 9 ? '0' + hours.second : hours.second

        dayAndMonth.day = dayAndMonth.day <= 9 ? '0' + dayAndMonth.day : dayAndMonth.day
        dayAndMonth.month = dayAndMonth.month <= 9 ? '0' + dayAndMonth.month : dayAndMonth.month

        let date = `${hours.hour}:${hours.minute}:${hours.second}(${dayAndMonth.day}/${dayAndMonth.month})`

        var messageObj = {
            author: author,
            message: message,
            hour: date
        };
    }
    renderMessage(messageObj);
    socket.emit("sendMessage", messageObj);
});
