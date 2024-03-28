document.addEventListener('DOMContentLoaded', () => {

    //work network
    const ws = new WebSocket('websocket');
    //test network
    // const ws = new WebSocket('ws://127.0.0.1:8080');

    const nav = document.querySelectorAll('a');

    const messages = document.getElementById('messages'); // useb below

    const newMessage = ( author, userMessage ) => {
        const messageContainer = document.createElement('div');
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

        if (author == nickname || author == 'You') {
            name.style.color = '#00ccff';
            messageContainer.classList.add('your');

            messageContainer.appendChild(message);
            messages.appendChild(messageContainer);
        } else {
            messageContainer.classList.add('other');

            messageContainer.appendChild(message);
            messages.appendChild(messageContainer);
        }

        // messages.appendChild(message);
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

        if (message == '' || message.length >= 500) return;

        // newMessage('You', message);
        ws.send(JSON.stringify({
            author: nickname,
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

    ws.onmessage = (response) => {
        response = JSON.parse(response.data);
        newMessage(response.author, response.message);

        if (response.author !== 'You') {
            const notificationSound = new Audio('./scr/audio/notification.mp3');
            notificationSound.play();
        };
    }

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
