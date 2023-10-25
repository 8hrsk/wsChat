const express = require('express');
const ws = require('ws');
const fs = require('fs');

// const wsServer = new ws.Server({ host: '45.87.246.20', port: 8080});

const wsServer = new ws.Server({ port: 8080});

wsServer.on('listening', () => {
    console.log('listening', wsServer.address());
})

wsServer.on('connection', (ws) => {
    console.log('new connection');

    const lastMessages = JSON.parse(fs.readFileSync('./lastMEssages.json', 'utf8'));

    lastMessages.messages.forEach((message) => {
        ws.send(message);
    })

    ws.on('message', (data) => {
        const { author, message } = JSON.parse(data);

        console.log(author, message);
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
                        author: author,
                        message
                    })
                    client.send(data)
                }
            }

            fs.readFile('./lastMEssages.json', 'utf8', (err, rawdata) => {
                if (err){
                    console.log(err);
                } else {
                    let obj = JSON.parse(rawdata);

                    if (obj.messages.length > 100) {
                        obj.messages.shift();
                    }
                    data = JSON.parse(data);
                    data.author = author;
                    data = JSON.stringify(data);
                    obj.messages.push(data);

                    let json = JSON.stringify(obj);
                    fs.writeFile('./lastMEssages.json', json, 'utf8', (err) => {if (err) return console.log(err)});
            }});
        })
    });
});

wsServer.on('err', (err) => {
    console.log(err);
})

const app = express();
const port = 3000;
const path = require('path');
const { json } = require('express');


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})