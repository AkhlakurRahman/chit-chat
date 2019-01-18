const socket = io();

socket.on('connect', function () {
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const li = $('<li class="list-group-item"></li>');
	const small = $(`<br><i><small class="ml-2">at ${formattedTime}</small></i>`);
	li.text(`${message.from}: ${message.text}`);
	li.append(small);


	$('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const li = $('<li class="list-group-item"></li>');
	const a = $('<a class="text-success" target="_blank">My current location</a>');
	const small = $(`<br><i><small class="ml-2">at ${formattedTime}</small></i>`);

	li.text(`${message.from}: `);
	a.attr('href', message.url);
	li.append(a);
	li.append(small);
	$('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
	e.preventDefault();

	const messageTextbox = $('[name=message]');

	socket.emit('createMessage', {
		from: 'User',
		text: messageTextbox.val()
	}, function () {
		messageTextbox.val('')
	});
});

const locationButton = $('#send-location');
locationButton.on('click', function () {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage', {
		  latitude: position.coords.latitude,
		  longitude: position.coords.longitude
		});
	}, function () {
		locationButton.removeAttr('disabled').text('Send location');
		alert('Unable to fetch location.');
	});
});
