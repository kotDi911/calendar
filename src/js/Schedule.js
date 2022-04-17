import {calendarMonth, calendarYear} from "./Calendar";
import {api} from "./API";

export class Schedule {
    constructor(options) {
        this.options = options;

        this.container = document.createElement('div');
        this.sumHoursContainer = document.createElement('div');
        this.sumHours = document.createElement('span');
        this.sumMoneyContainer = document.createElement('div');
        this.sumMoney = document.createElement('span');
        this.closeBtn = document.createElement('button');
        this.updateBtn = document.createElement('button');

        this.container.classList.add('schedule-cont');
        this.sumHoursContainer.classList.add("flex-column", 'sch-info');
        this.sumMoneyContainer.classList.add("flex-column", 'sch-info');
        this.sumHours.classList.add('sum-hours');
        this.sumMoney.classList.add('sum-money');

        this.closeBtn.classList.add('btn', 'update-schedule-btn');
        this.updateBtn.classList.add('btn', 'update-schedule-btn');

        this.sumHoursContainer.innerText = 'Время роботы за месяц: ';
        this.sumMoneyContainer.innerText = 'Сумма за месяц: ';

        this.closeBtn.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
        this.updateBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i>`;

        this.closeBtn.addEventListener('click', () => this.container.style.display = 'none');
        this.updateBtn.addEventListener('click', async () => {
            await api.getCalendar({month: calendarMonth, year: calendarYear})
                .then((res) => {
                    return Schedule.getSum(res)
                })
                .then((res) => {
                    return this.createText(res)
                });
        });

        this.sumHoursContainer.append(this.sumHours);
        this.sumMoneyContainer.append(this.sumMoney);
        this.createText(Schedule.getSum(this.options));

        if(window.innerWidth < 551){
            this.container.classList.add('space-between');
            this.container.append(this.updateBtn, this.sumHoursContainer, this.sumMoneyContainer, this.closeBtn)
        }else {
            this.container.append(this.updateBtn, this.sumHoursContainer, this.sumMoneyContainer)
        }
    }

    static getSum(options) {
        let arr = [];
        let sumHours = 0;
        let sumMinutes = 0;
        let sumMoney = 0;

        for (let key in options) {
            let elem = options[key];
            let timeOver = elem.timeover.replace(/:/g,'');
            let timeStart = elem.timestart.replace(/:/g,'');
            let money = Number(elem.money);
            let hours = Number(timeOver.slice(0,2)) - Number(timeStart.slice(0,2));
            let minutes = Number(timeOver.slice(2,4)) - Number(timeStart.slice(2,4));
            arr[arr.length] = {hours: hours, minutes: minutes, money: money};
        }

        arr.forEach((elem) => {
            sumHours += elem.hours;
            sumMinutes += elem.minutes;
            sumMoney += elem.money;
            if (sumMinutes > 60) {
                sumHours++;
                sumMinutes -= 60
            }
            if(sumMinutes < 0){
                sumHours--;
                sumMinutes += 60
            }
        });

        if (sumMinutes < 10) {
            sumMinutes = '0' + sumMinutes;
        }
        return {hours: sumHours, minutes: sumMinutes, money: sumMoney}
    }

    createText(options) {
        const {hours, minutes, money} = options;
        this.sumHours.innerText = `${hours}-ч. ${minutes}-мин.`;
        this.sumMoney.innerText = `${money} $`;
    }

    render() {
        return this.container;
    }
}