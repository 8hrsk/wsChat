document.addEventListener('DOMContentLoaded', () => {

    //work network
    // const ws = new WebSocket('ws://45.87.246.20:8080');
    //test network
    const ws = new WebSocket('ws://127.0.0.1:8080');

    const nav = document.querySelectorAll('a');

    const newMessage = ( author, userMessage ) => {
        const message = document.createElement('div');
        message.classList.add('message');

        const messageText = document.createElement('div');
        messageText.classList.add('messageText');
        messageText.innerText = userMessage;

        const name = document.createElement('span');
        name.classList.add('name');
        name.innerText = author;

        message.appendChild(name);
        message.appendChild(messageText);

        if (author == 'You') name.style.color = '#00ccff';

        document.getElementById('messages').appendChild(message);
    }

    nav.forEach((navItem) => {

        if (navItem.id == 'reconnect') {
            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.reload();
            })
        }

        if (navItem.id == 'about') {
            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('about');
                const modal = document.getElementById('modal');
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 2500);
            })
        }

        navItem.addEventListener('click', (e) => {
            e.preventDefault();

            if (navItem.href == '') return;
            window.open(navItem.href, '_blank');
        })
    })

    const sendButton = document.getElementById('send');
    const messageInput = document.getElementById('message');

    sendButton.addEventListener('click', (e) => {
        const message = messageInput.value;
        messageInput.value = '';

        if (message == '') return;

        // newMessage('You', message);
        ws.send(JSON.stringify({
            message
        }));
    });

    window.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') sendButton.click();
    })

    ws.onerror = (e) => {
        console.log(e);
    }

    ws.onopen = () => {
        console.log('Connection established');
    }

    ws.onclose = () => {
        console.log('Connection closed');
    }

    const notificationSound = new Audio('./scr/audio/notification.mp3');

    ws.onmessage = (response) => {
        response = JSON.parse(response.data);
        newMessage(response.author, response.message);
        if (response.author !== 'You') {
            notificationSound.play();
        };
    }

    const messages = document.querySelector('.messages');

    new MutationObserver(() => {
        const lastMessage = messages.lastElementChild;

        if (lastMessage) {
            lastMessage.scrollIntoView();
        }
    })
    .observe(messages, {
        childList: true,
        subtree: true
    })
})