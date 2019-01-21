const socket = io();

socket.on('connect', function () {
	const params = $.deparam(window.location.search);

	socket.emit('join', params, function (error) {
		if (error) {
			alert('Fill bitch');
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	})
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

const scrollToBottom = () => {
	const messages = $('#messages');
	const newMessage = messages.children('li:last-child');

	const clientHeight = messages.prop('clientHeight');
	const scrollTop = messages.prop('scrollTop');
	const scrollHeight = messages.prop('scrollHeight');
	const newMessageHeight = newMessage.innerHeight();
	const lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
};

socket.on('updateUserList', (users) => {
	const ol = $('<ol></ol>');

	users.forEach((user) => {
		ol.append($('<li></li>').text(user));
	});

	$('#users').html(ol);
});

socket.on('newMessage', function (message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = $('#message-template').html();

	const html = Mustache.render(template, {
		from: message.from,
		createdAt: formattedTime,
		message: message.text
	});

	$('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = $('#location-template').html();
	const html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});

	$('#messages').append(html);
	scrollToBottom();
});

$('#message-form').on('submit', function (e) {
	e.preventDefault();

	const messageTextbox = $('[name=message]');

	socket.emit('createMessage', {
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
