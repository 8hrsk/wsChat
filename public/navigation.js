const navigation = {
    openNav: document.getElementById('menu'),
    closeNav: document.getElementById('menuClose'),
    settings: document.getElementById('settings')
}

const nickChange = document.getElementById('changeNickname');

const createRandomNick = () => {
    const nick = Math.random().toString(36).substring(7);
    return nick;
}

let nickname = createRandomNick();

nickChange.addEventListener('click', () => {
    const changeNicknameSound = new Audio('./scr/audio/nickchange.mp3');
    changeNicknameSound.play();
    const newNick = document.getElementById('nickname').value;

    if (newNick == '' || newNick == nickname || newNick.length > 15) return;

    nickname = newNick;
})

const menu = document.getElementById('burger');

navigation.settings.addEventListener('click', () => {
    menu.style.display = 'block';
    navigation.openNav.style.display = 'block';
})

navigation.openNav.addEventListener('click', () => {
    navigation.openNav.style.display = 'none';
    menu.style.display = 'block';
})

navigation.closeNav.addEventListener('click', () => {
    menu.style.display = 'none';
    navigation.openNav.style.display = 'block';
})

