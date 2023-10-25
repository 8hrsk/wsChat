const navigation = {
    openNav: document.getElementById('menu'),
    closeNav: document.getElementById('menuClose'),
    settings: document.getElementById('settings')
}

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