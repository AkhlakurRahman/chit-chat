const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newEmail', (email) => {
    console.log('New email', email);
});

socket.on('newMessage', (message) => {
    console.log('Message', message);

    const li = $('<li class="list-group-item"></li>');

    li.text(`${message.from}: ${message.text}`);
    $('.list-group').append(li);
});

$('#message').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message_input]').val()
    }, () => {

    })
});