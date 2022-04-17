import Auth from "./js/Auth";
import {Board} from "./js/Board";
import "./style.css"

const body = document.body;
body.classList.add('body', 'flex-column', 'space-between');
const appContainer = document.createElement('div');
appContainer.classList.add('app');
const user = JSON.parse(localStorage.getItem('data'));

export const init = () => {
    document.body.innerText = '';
    if (appContainer) {
        appContainer.innerText = ''
    }
    body.setAttribute('auth', '');
    document.body.append(appContainer);
    new Auth(appContainer);
};

if (!user) {
    init();
} else {

    new Board(user).render(body);
}