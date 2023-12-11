// Connect to the server
var socket = io.connect('http://localhost:3000');

// Emit a 'command' event with data
socket.emit('command', { data: 'Hello World!' });