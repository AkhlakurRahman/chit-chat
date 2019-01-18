const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');


    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chit-Chat'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined'));

    socket.on('createMessage', (message, callback) => {
        //console.log('From user', message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from server!');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});



server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});