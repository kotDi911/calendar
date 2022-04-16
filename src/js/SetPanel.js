import {api} from "./API";
import {Task} from "./Task";
import Form from "./Form";
import {taskConfig} from "./taskConfig";
import {Input} from "./Input";

export const handleCloseBtn = (id, main) => {
    const panelCont = document.querySelector('.panel-cont');
    const panelOption = document.querySelector('.panel-options');
    panelOption.remove();
    panelCont.prepend(new SetPanel(id, main).render());
};

export class SetPanel {
    constructor(id, main) {
        this.userId = id;
        this.panelContainer = document.createElement('div');
        this.tasksCont = document.createElement('div');
        this.btnBox = document.createElement('div');
        this.popUpForm = document.createElement('div');
        this.createBtn = document.createElement('button');
        this.setBtn = document.createElement('button');
        this.closeBtn = document.createElement('button');

        this.main = main;
        this.createPanel(this.userId)
    }

    handleTaskCreate = () => {
        this.popUpForm.classList.add('pop-up-form');
        const panelCont = document.querySelector('.panel-cont');
        new Form({
            title: "Create task",
            inputs: taskConfig.map((input) => new Input(input)),
            submitBtnText: "Submit",
            onSubmit: async (data) => {
                data = {...data, userId: this.userId};
                await api.createTask(data);
                // tasks = [...tasks, data];
                this.panelContainer.remove();
                panelCont.prepend(new SetPanel(this.userId, true).render());
                this.popUpForm.remove();
            },
        }).render(this.popUpForm);
        this.panelContainer.append(this.popUpForm);
    };
    handleCloseBtn = () => {
        handleCloseBtn(this.userId, true);
    };
    handleTaskSet = () => {
        handleCloseBtn(this.userId, false);
    };

    createPanel() {
        this.panelContainer.classList.add('panel-options', 'flex-column');
        this.tasksCont.classList.add('tasks', 'flex-column');
        this.btnBox.classList.add('flex');

        this.createBtn.classList.add('btn', 'panel-btn');
        this.createBtn.innerText = 'Create';
        this.createBtn.addEventListener('click', this.handleTaskCreate);

        this.setBtn.classList.add('btn', 'panel-btn');
        this.setBtn.innerText = 'Set';
        this.setBtn.addEventListener('click', this.handleTaskSet);

        this.closeBtn.classList.add('btn', 'close-btn');
        this.closeBtn.innerText = 'Close';
        this.closeBtn.addEventListener('click', this.handleCloseBtn);

        this.btnBox.append(this.createBtn,this.setBtn);

        if (this.main) {
            this.panelContainer.prepend(this.btnBox,  this.tasksCont);
        } else {
            this.panelContainer.prepend(this.closeBtn, this.tasksCont);
            this.addTask({name: 'Clear task', color: '#110909b3'});
        }

        this.getTask(this.userId)
    }

    async getTask(id) {
        const taskList = await api.getAllTasks(id);
        taskList.forEach((task) => this.addTask(task))
    }

    addTask(data) {
        const task = new Task(data, this.main);
        task.render(this.tasksCont);
    }

    render() {
        return this.panelContainer;
    }
}