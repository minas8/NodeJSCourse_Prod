const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

const chatHandler = server => {
    // -- 2. INITIALIZE THE WS SERVER --
    const wss = new WebSocket.Server({ server });

    // -- 3 Handling Client connections --
    wss.on('connection', ws => {
        // A) In case of a message from the client
        ws.on('message', message => {
            console.log(`Received: ${message}`);

            // Send connection message
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            })
        });

        // B) Send a 'connection' message
        console.log('Client connected');
        ws.send('Welcome to the chat');
    });
};

module.exports = { chatHandler };