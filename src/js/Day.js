import {opt} from "./Task";
import {api} from "./API";

export class Day {
    constructor(date, month, year, data) {
        this.popUpContainer = document.createElement('div');
        this.popUpContainer.classList.add('pop-up-cont');
        this.date = date;
        this.month = month + 1;
        this.year = year;
        this.id = null;

        if(this.date < 10){
            this.date = '0' + this.date;
        }
        if(this.month < 10){
            this.month = '0' + (this.month)
        }

        this.dataDate = `${this.year}-${this.month}-${this.date}`;

        this.containerDay = document.createElement('div');
        this.containerDay.classList.add('number-day');
        this.taskNameCont = document.createElement('p');
        this.taskNameCont.classList.add('task-name');
        this.number = document.createElement('span');
        this.number.innerText = date;

        for (let keys in data) {
            let key = data[keys];
            if(key.date === this.dataDate){
                this.taskNameCont.innerText = key.name;
                this.taskNameCont.style.background = key.color;
                this.id = key.id;
            }
        }

        if (date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            this.containerDay.style.border = '4px solid red';
        }

        this.createDay(date)
    }

    handleListener = async (e) => {
        const elem = e.target;
        const name = elem.localName;

        try{
            if(name === "div"){
                const child = elem.lastChild;
                child.style.background = opt.color;
                child.innerText = opt.name;
            }else if(name === "span"){
                const nextChild = elem.nextElementSibling;
                nextChild.style.background = opt.color;
                nextChild.innerText = opt.name;
            }else if(name === "p"){
                elem.style.background = opt.color;
                elem.innerText = opt.name;
            }

            if(opt.name === ''){
                if(this.id !== null){
                    console.log(this.id, 'delete');
                    await api.delCalendar({id: this.id})
                }
                else {
                    this.getTask({month: this.month, year: this.year}).then(r => this.deleteTask(r));
                }
            }else {
                    this.getTask({month: this.month, year: this.year}).then(r => {
                        console.log(r)
                        this.deleteTask(r);
                        this.createTask({id: opt.id, date: this.dataDate});
                    }).then(r => console.log(r));
                }
                console.log('taskId: ' + opt.id, 'set')

        }catch (e) {
            console.log(e)
        }
    };

    async getTask(data){
        //month, year = data
        const res = await api.getCalendar(data);
        for (let keys in res) {
            let key = res[keys];
            if (key.date === this.dataDate) {
                return this.id = key.id;
            }
        }
        return this.id
    }

    async deleteTask(id){
        console.log('dayId: ' + id, 'delete');
        this.id = null;
        return await api.delCalendar({id: id});
    }

    async createTask(data){
        return await api.addCalendar(data);
    }

    createDay(date){
        switch (typeof date) {
            case "string":
                this.containerDay.classList.add('day-of-week');
                this.containerDay.append(this.number);
                break;
            case "number":
                this.containerDay.classList.add('day', 'flex-column');
                this.containerDay.setAttribute('date', this.dataDate);
                this.containerDay.addEventListener('click', this.handleListener);
                this.containerDay.append(this.number, this.taskNameCont);
                break;
            default:
                this.containerDay.classList.add('empty');
                break;
        }
    }

    static renderDaysOfWeek(options, container) {
        const {title} = options;
        new Day(title).render(container);
    }

    render(container) {
        container.append(this.containerDay);
    }
}
