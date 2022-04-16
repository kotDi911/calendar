import {Calendar} from "./Calendar";
import {Schedule} from "./Schedule";
import {SetPanel} from "./SetPanel";
import {init} from "../index";
import {api} from "./API";

export class Board {
    constructor(options) {
        const {name, id} = options;
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth();
        this.date = new Date().getDate();
        this.name = name;
        this.id = id;
        const calendar = new Calendar({year: this.year, month: this.month, id: this.id});
        this.setPanel = new SetPanel(this.id, true).render();

        document.body.setAttribute('month', this.month + 1);

//---------------------------------------- header ----------------------------------------//
        this.headerContainer = document.createElement('header');
        this.avatarContainer = document.createElement('div');
        this.logo = document.createElement('span');
        this.avatar = document.createElement('span');
        this.logoutBtn = document.createElement('button');
        this.curentDate = document.createElement('span');
        this.setBtnContainer = document.createElement('div');
        this.settingsBtn = document.createElement('button');
        this.scheduleBtn = document.createElement('button');
//---------------------------------------- main ----------------------------------------//
        this.mainContaimer = document.createElement('main');
        this.containerCalendar = document.createElement('div');
        this.setPanelContainer = document.createElement('div');
        this.popUpContainer = document.createElement('div');
//---------------------------------------- footer ----------------------------------------//
        this.footerContainer = document.createElement('footer');
        this.info = document.createElement('span');
        this.contacts = document.createElement('a');

        this.createHeader();
        this.createMain(calendar);
        this.createFooter();
    }

    createHeader() {
        const avatar = this.avatar;

        this.headerContainer.classList.add('header', 'flex', 'space-between');
        this.avatarContainer.classList.add('logo-cont', 'flex');
        this.settingsBtn.classList.add('set-cont-btn', 'settings-btn');
        this.scheduleBtn.classList.add('set-cont-btn', 'schedule-btn');
        this.setBtnContainer.classList.add('set-cont');
        this.logoutBtn.classList.add('set-cont-btn');
        this.avatar.classList.add('avatar');
        this.logo.classList.add('logo');

        this.settingsBtn.innerText = 'Settings';
        this.scheduleBtn.innerText = 'Schedule';
        this.logoutBtn.innerText = "Logout";

        this.avatar.innerText = this.name[0];
        this.logo.innerText = "N.Schedule";

        this.avatar.addEventListener("click", function () {
            avatar.classList.toggle("active");
            let content = avatar.nextElementSibling;
            if (content.style.maxWidth) {
                content.style.maxWidth = null;
            } else {
                content.style.maxWidth = '100%';
            }
        });
        this.logoutBtn.addEventListener("click", () => {
            document.body.removeAttribute('month');
            api.logout();
            init();
        });

        this.avatarContainer.append(this.avatar, this.setBtnContainer);
        this.setBtnContainer.append(this.settingsBtn, this.scheduleBtn, this.logoutBtn);
        this.headerContainer.append(this.logo, this.curentDate, this.avatarContainer);
    }

    createMain(calendar) {
        this.mainContaimer.classList.add('main-container', 'flex');
        this.setPanelContainer.classList.add('panel-cont', 'flex-column');
        this.containerCalendar.classList.add('calendar-cont');
        this.popUpContainer.classList.add('pop-up-cont');
        this.curentDate.classList.add('current-date');
        this.curentDate.innerText = `${this.date} / ${this.month + 1} / ${this.year}`;

        calendar.render(this.containerCalendar);
        this.setPanelContainer.append(this.setPanel);
        this.mainContaimer.append(this.containerCalendar, this.setPanelContainer)
    }

    createFooter() {
        this.footerContainer.classList.add('footer', 'flex', 'space-between');
        this.info.classList.add('info-text');
        this.contacts.classList.add('contacts');

        this.contacts.setAttribute('href', 'http://korshundev.zzz.com.ua/CV');

        this.info.innerText = 'Powered by N.G. beta-test';
        this.contacts.innerText = 'Страница разработчика';

        this.footerContainer.append(this.info, this.contacts);
    }

    render(container) {
        container.append(this.headerContainer, this.mainContaimer, this.footerContainer)
    }
}