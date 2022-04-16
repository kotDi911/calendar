import {api} from "./API";
import Form from "./Form";
import {taskConfig} from "./taskConfig";
import {Input} from "./Input";
import {SetPanel} from "./SetPanel";
import {Calendar} from "./Calendar";

export let opt;

export class Task {
    constructor(options, main) {
        const {name, color, id, users_id} = options;
        this.options = options;
        this.name = name;
        this.color = color;
        this.taskId = id;
        this.userId = users_id;
        this.main = main;

        this.popUpForm = document.createElement('div');

        this.container = document.createElement('div');
        this.taskName = document.createElement('div');
        this.taskColor = document.createElement('span');
        this.taskBtn = document.createElement('button');
        this.editBtn = document.createElement('button');
        this.dellBtn = document.createElement('button');

        this.create();
    }

    handleEditTask = async () => {
        this.popUpForm.classList.add('pop-up-form');
        const panelCont = document.querySelector('.panel-cont');
        const panelOption = document.querySelector('.panel-options');
        new Form({
            title: "Create task",
            inputs: taskConfig.map((input) => {

                // console.log(input)
                return new Input(input)
            }),
            submitBtnText: "Submit",
            onSubmit: async (data) => {
                data = {...data, id: this.taskId, userId: this.userId};
                await api.editTask(data);
                panelOption.remove();
                panelCont.prepend(new SetPanel(this.userId, true).render());
                this.popUpForm.remove();
            },
        }).render(this.popUpForm);
        panelOption.append(this.popUpForm);
    };

    handleDellTask = async () => {
        await api.deleteTask({id: this.taskId, userId: this.userId});
        this.container.remove();
    };

    create() {
        this.container.classList.add('task-container', 'flex');
        this.taskName.classList.add('task-name');
        this.taskColor.classList.add('task-color');
        this.editBtn.classList.add('edit-task-btn');
        this.dellBtn.classList.add('dell-task-btn');
        this.taskBtn.classList.add('task-btn', 'flex', 'space-between');

        this.taskName.innerText = this.name;
        this.taskColor.style.background = this.color;
        this.editBtn.innerHTML = `<i class="fa-solid fa-pen-clip"></i>`;
        this.editBtn.addEventListener('click', this.handleEditTask);
        this.dellBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        this.dellBtn.addEventListener('click', this.handleDellTask);

        this.taskBtn.addEventListener("click", () => {
            const el = document.querySelector('*[active-task]');
            if (el) {
                el.removeAttribute('active-task')
            }
            this.taskBtn.setAttribute('active-task', '');
            if (this.name === 'Clear task') {
                opt = {name: '', color: "none"};
                return opt
            }else {
                opt = this.options;
                return opt
            }
            // handleCloseBtn(this.userId, true)
            console.log(this.options)
            // const panelCont = document.querySelector('.panel-cont');
            // const panelOption = document.querySelector('.panel-options');
            // panelOption.remove();
            // panelCont.prepend(new SetPanel(this.userId, true).render());

            // this.options['date'] = '2022-04-11'
            // console.log(this.options)
        });

        this.taskBtn.append(this.taskName, this.taskColor);
        this.container.append(this.taskBtn);

        if (this.main) {
            this.container.append(this.editBtn, this.dellBtn);
            this.taskBtn.setAttribute('disabled', '')
        }
    }

    render(container) {
        container.append(this.container);
    }
}