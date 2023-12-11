// Include the necessary modules
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mysql = require("mysql");

/* Creating POOL MySQL connection.*/

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'GodIsGoodWWJD_3',
    database: 'Status',
    debug: false
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

/* This is auto initiated event when Client connects to Your Machine. */

io.on('connection', function(socket) {
    console.log("A user is connected");

    // Listen for the 'status added' event
    socket.on('status added', function (status) {
        console.log('Status received: ', status);
        // Insert the new status into the 'status' table
        pool.getConnection(function (err, connection) {
          if (err) throw err; // Not connected!
          connection.query('INSERT INTO status (content) VALUES (?)', [status], function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();
            if (error) throw error;
            console.log('Status added to the database');
          });
        });
    });

    socket.on('disconnect', function () {
        console.log('a user disconnected');
    });
});

// Start the server
server.listen(3000, function() {
    console.log('Server is running on port 3000');
});