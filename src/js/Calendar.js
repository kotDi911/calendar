import {dayConfig} from "./taskConfig";
import {Day} from "./Day";
import {api} from "./API";
import {Schedule} from "./Schedule";

export let calendarMonth;
export let calendarYear;

export class Calendar {
    constructor(options) {
        const {year, month, id} = options;
        this.userId = id;
        this.year = year;
        this.month = month;
        this.getMonth = month + 1;

        calendarMonth = this.getMonth;
        calendarYear = this.year;
        this.calendarContainer = document.createElement('div');
        this.optionsCalendar = document.createElement('div');
        this.prevMonthBtn = document.createElement('button');
        this.containerDate = document.createElement('span');
        this.nextMonthBtn = document.createElement('button');

        this.createCalendar(this.calendarContainer);
    }

    static getDay(date) {
        let day = date.getDay();
        if (day === 0) day = 7;
        return day - 1;
    }

    createDay(container, data) {
        let d = new Date(this.year, this.month);
        dayConfig.map((title) => {
            Day.renderDaysOfWeek(title, container)
        });
        for (let i = 0; i < Calendar.getDay(d); i++) {
            new Day().render(container)
        }
        while (d.getMonth() === this.month) {
            new Day(d.getDate(), d.getMonth(), d.getFullYear(), data).render(container);
            d.setDate(d.getDate() + 1);
        }
        if (Calendar.getDay(d) !== 0) {
            for (let i = Calendar.getDay(d); i < 7; i++) {
                new Day().render(container)
            }
        }
    }

    getCal = async (container) => {
        const data = {month: this.getMonth, year: this.year, userId: this.userId};
        const res = await api.getCalendar(data);
        const panelCont = document.querySelector('.panel-cont');
        const schedulePanel = document.querySelector('.schedule-cont');
        if(schedulePanel){
            schedulePanel.remove();
        }
        panelCont.append(new Schedule(res).render());
        this.createDay(container, res);
    };

    updateCalendar = () => {
        document.querySelector('.calendar-cont').innerText = '';
        document.body.setAttribute('month', this.getMonth);
        new Calendar({
            year: this.year,
            month: this.month,
            id: this.userId
        }).render(document.querySelector('.calendar-cont'))
    };

    prevMonthListener = () => {
        this.month--;
        this.getMonth--;
        if (this.getMonth < 1) {
            this.getMonth = 12;
        }
        if (this.month < 0) {
            this.month = 11;
            this.year--;
        }
        this.updateCalendar();
    };

    nextMonthListener = () => {
        this.month++;
        this.getMonth++;
        if (this.getMonth > 12) {
            this.getMonth = 1;
        }
        if (this.month > 11) {
            this.month = 0;
            this.year++;
        }
        this.updateCalendar();
    };

    createCalendar(container) {
        this.getCal(container);

        this.calendarContainer.classList.add('calendar');
        this.optionsCalendar.classList.add('options-cont', 'flex', 'space-between');
        this.containerDate.classList.add('date');
        this.containerDate.classList.add('date');
        this.containerDate.innerText = `${this.getMonth} / ${this.year}`;

        this.prevMonthBtn.classList.add('btn', 'calendar-btn', 'prev');
        this.prevMonthBtn.innerText = '<< Prev';
        this.prevMonthBtn.addEventListener('click', this.prevMonthListener);

        this.nextMonthBtn.classList.add('btn', 'calendar-btn', 'next');
        this.nextMonthBtn.innerText = 'Next >>';
        this.nextMonthBtn.addEventListener('click', this.nextMonthListener);

        this.optionsCalendar.append(this.prevMonthBtn, this.containerDate, this.nextMonthBtn);
    }

    render(container) {
        container.append(this.optionsCalendar, this.calendarContainer)
    }
}