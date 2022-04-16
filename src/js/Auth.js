import {api} from "./API";
import Form from "./Form";
import {Input} from "./Input";
import {loginConfig, registerConfig} from "./taskConfig";
import {Board} from "./Board";

const onReady = (appContainer) => {
    appContainer.remove();
    document.body.removeAttribute('auth');
};
const getLoginForm = (appContainer) =>
    new Form({
        title: "",
        inputs: loginConfig.map((input) => new Input(input)),
        submitBtnText: "Submit",
        onSubmit: async (data) => {
            const user = await api.login(data);
            onReady(appContainer);
            return new Board({name: user.name, id: user.id}).render(document.body)
        },
    }, true);

const getRegisterForm = (appContainer) =>
    new Form({
        title: "",
        inputs: registerConfig.map((input) => new Input(input)),
        submitBtnText: "Submit",
        onSubmit: async (data) => {
            const user = await api.register(data);
            onReady(appContainer);
            return new Board({name: data.name, id: user.id}).render(document.body)
        },
    }, true);

export class Auth {
    constructor(appContainer) {
        this.appContainer = appContainer;
        this.formContainer = document.createElement('div');
        this.switchBtn = document.createElement('button');

        this.loginForm = getLoginForm(appContainer);
        this.regsterForm = getRegisterForm(appContainer);

        this.login = false;
        this.form = null;

        this.renderAuthForm();
        this.createFormContainer();
    }

    createFormContainer() {
        this.formContainer.classList.add('auth-form');
        this.switchBtn.classList.add('switch');
        this.switchBtn.innerText = 'REGISTER';
        this.switchBtn.addEventListener("click", () => {
            this.renderAuthForm();
        });
    }

    renderAuthForm() {
        this.login = !this.login;

        if (this.form) {
            this.form.form.remove();
        }

        if (this.login) {
            this.switchBtn.innerText = 'REGISTER';
            this.form = this.regsterForm;
        } else {
            this.switchBtn.innerText = 'LOGIN';
            this.form = this.loginForm;
        }

        this.formContainer.append(this.switchBtn);
        this.form.render(this.formContainer);
        this.appContainer.append(this.formContainer)
    }

    logout() {
        this.renderAuthForm();
    }
}

export default Auth