const express = require('express');
const ws = require('ws');
const fs = require('fs');

const wsServer = new ws.Server({ host: 'websocket', port: 8080});

// const wsServer = new ws.Server({ host: '127.0.0.1', port: 8080});

const regexpCheck = (string) => {
    const regExp = /^[a-zA-Zа-яёА-ЯЁ0-9\s.,!";%:?*()_+@#$%^&-=~`<>\/?\\\[\]\{}]+$/;
    return regExp.test(string);
}

wsServer.on('listening', () => {
    console.log('listening', wsServer.address());
})

wsServer.on('connection', (ws) => {
  console.log('new connection');

  const lastMessages = JSON.parse(fs.readFileSync('./lastMEssages.json', 'utf8'));

  lastMessages.messages.forEach((message) => {
    ws.send(message);
  });

  let client = {
    messagesPerSecond: 0,
    lastMessageTime: Date.now()
  };

  ws.on('message', (data) => {
    let now = Date.now();
    let elapsed = now - client.lastMessageTime;
    if (elapsed > 1000) {
      client.messagesPerSecond = 0;
    }
    client.lastMessageTime = now;
    client.messagesPerSecond++;
    if (client.messagesPerSecond > 5) { // ограничение на 10 сообщений в секунду
      ws.close();
      return;
    }

    let { author, message } = JSON.parse(data);

    message = message.trim();
    author = author.trim();

    console.log(author, message);

    console.log(regexpCheck(author), regexpCheck(message));

    if (!regexpCheck(author) || !regexpCheck(message)) return;

    if (author == '' || author.length > 15) return;
    if (author == 'You') {
      author = 'Anon';
    }

    console.log(author, message);
    if (message == '' || message.length >= 500) return;

    wsServer.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        if (client == ws) {
          data = JSON.stringify({
            author: 'You',
            message
          });
        } else {
          data = JSON.stringify({
            author: author,
            message
          });
        }
        client.send(data);
      }
    });

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
      }
    });
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
