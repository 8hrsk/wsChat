const express = require('express');
const ws = require('ws');

// const wsServer = new ws.Server({ host: '45.87.246.20', port: 8080});

const wsServer = new ws.Server({ port: 8080});

wsServer.on('listening', () => {
    console.log('listening', wsServer.address());
})

wsServer.on('connection', (ws) => {
    console.log('connection');
    
    ws.on('message', (data) => {
        const { message } = JSON.parse(data);

        console.log(message);
        if (message == '') return;

        wsServer.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                if (client == ws) {
                    data = JSON.stringify({
                        author: 'You',
                        message
                    })
                    client.send(data)
                } else {
                    data = JSON.stringify({
                        author: 'Anonymous',
                        message
                    })
                    client.send(data)
                }
            }
        })
    });
});

wsServer.on('err', (err) => {
    console.log(err);
})

const app = express();
const port = 3000;
const path = require('path');


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.listen(port, () => {
    console.log(`Example app listening at http://45.87.246.20:${port}`);
})