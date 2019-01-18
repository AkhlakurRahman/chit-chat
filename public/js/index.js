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
    //console.log('Message', message);

    const li = $('<li class="list-group-item"></li>');

    li.text(`${message.from}: ${message.text}`);
    $('.list-group').append(li);
});

socket.on('newLocationMessage', (message) => {
    const li = $('<li class="list-group-item"></li>');
    const a = $('<a class="text-success" target="_blank"> My current location</a>');

    li.text(`${message.from}`);
    a.attr('href', message.url);
    li.append(a);

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

const locationButton = $('#send_location');

locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Your browser does not support geolocation');
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        alert('Unable to fetch location!');
    })
});






















