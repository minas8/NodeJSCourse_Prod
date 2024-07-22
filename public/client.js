let ws;

function connectWebSocket() {
    // 1. Create an instance of a WebSocket pointing to a specific server and port
    ws = new WebSocket('ws://localhost:3006');

    // 2. Event handling - onopen, onmessage, onclose
    // - Connection as made to the server
    ws.onopen = () => {
        console.log('Connected to the server');
    };

    // - Server sends a message to me
    ws.onmessage = (event) => {
        const chat = document.getElementById('chat');
        const message = document.createElement('div');

        // Server sends data as a 'blob' - event.data
        const reader = new FileReader();

        // Asynchronous function
        reader.onload = () => {
            message.textContent = reader.result;
            chat.appendChild(message);
        }

        if (event.data instanceof Blob) {
            reader.readAsText(event.data);
        }
    };

    // - Connection to server closed
    ws.onclose = () => {

    };
}

function sendMessage() {
    // send a message to the server
    if (ws.readyState === WebSocket.OPEN) {
        const input = document.getElementById('message');
        ws.send(input.value);

        // Clear the input text
        input.value = '';
    }
}

connectWebSocket();