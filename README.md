# wsChat

Chat SPA based on ws WebSocket + express.
To start server you have to install npm + NodeJS. Clone repository and use `npm i` to automatically download all dependencies.

Use `npm start` to host local server. To connect press `ctrl` and click the link in the terminal.

You can visit [my website](https://chat.8hoursking.ru) and see it online

## TODO
- [x] Make a domain name.
- [x] Add caching of last 100 messages. (made not by caching, but by using a json).
- [x] Add custon usernames.
- [ ] Refactor front to Vue.js + SASS/SCSS.
- [ ] make extended settings.
- [x] Make validation for usernames and messages
- [ ] Make alerts on errors.
- [ ] Animations for modals.
- [x] Add force closing of WS connection whem messages/second limit passed.
- [ ] Try to make small file sharing (pics and GIFs).
- [ ] Make a Config.json file for better start experience.
- [x] Add ans ssl-sertificate.
- [ ] Refactor all JS to TS
