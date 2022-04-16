class ApiError extends Error {
    constructor({message, data}) {
        super(message);
        this.data = data;
    }
}

export default class Form {
    constructor(options, auth = false) {
        const {inputs} = options;

        this.submitBtn = document.createElement("button");
        this.closeBtn = document.createElement("button");
        this.inputs = inputs;
        this.form = document.createElement("form");
        this.form.classList.add('form', 'flex-column');
        this.auth = auth;

        this.createForm(options);
    }

    static getFormValues(inputs) {
        return inputs.reduce((values, input) => {
            values[input.name] = input.value;
            return values;
        }, {});
    }

    registerValid = (data) => {
        const {login, pass, name} = data;
        const regLogin = /[\W\w]{6,}/;
        const regPass = /[\W\w]{6,}/;
        const regName = /\w{2,}/;

        if (!regLogin.test(login)) {

            throw new ApiError({
                message: "Error! ",
                data: [{path: "login", message: 'login invalid'}],
            })
        }
        if (!regPass.test(pass)) {

            throw new ApiError({
                message: "Error! ",
                data: [{path: "pass", message: "Password invalid"}],
            })
        }
        if (!regName.test(name)) {

            throw new ApiError({
                message: "Error! ",
                data: [{path: "name", message: "Name invalid"}],
            })
        }
    };

    createForm({onSubmit, submitBtnText, title: titleText}) {
        const handleClose = () => {
            const popUp = document.querySelector('.pop-up-form');
            this.form.remove();
            popUp.remove()
        };

        const title = document.createElement("h2");
        title.innerText = titleText;
        title.classList.add("form-title");

        this.submitBtn.type = "submit";
        this.submitBtn.innerText = submitBtnText;
        this.submitBtn.classList.add("btn", "btn-form");

        this.closeBtn.classList.add("btn", "btn-form");
        this.closeBtn.innerText = 'Close';
        this.closeBtn.addEventListener('click', handleClose);

        this.form.addEventListener("submit", async (event) => {
            event.preventDefault();

            this.formValues = Form.getFormValues(this.inputs);
            this.submitBtn.setAttribute("disabled", "");

            try {
                this.registerValid(this.formValues);
                await onSubmit(this.formValues, event);
            } catch (err) {
                console.log(err);

                if (err.data.message) {
                    this.inputs.find((input) => input.updateErrorMessage(err.data.message));
                } else {
                    err.data.forEach(({path, message}) => {
                        if (err.data.message) {
                            this.inputs.updateErrorMessage()
                        }
                        const erroredInput = this.inputs.find((input) => {
                            return input.name === path;
                        });
                        erroredInput.updateErrorMessage(message);
                    });
                }
            }

            this.submitBtn.removeAttribute("disabled");
        });

        this.form.append(title);

        this.inputs.forEach((input) => {
            input.render(this.form);
        });

        this.form.append(this.submitBtn);

        if(!this.auth){
            this.form.append(this.closeBtn)
        }
    }

    render(container) {
        container.append(this.form);
    }
}