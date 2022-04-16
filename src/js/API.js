class ApiError extends Error {
    constructor({message}) {
        super(message);
        this.message = message;
    }
}

class API {
    constructor() {
        this.token = null;
        this.userId = null;
        const user = JSON.parse(localStorage.getItem('data'));
        if(user){
            this.token = user.token;
            this.userId = user.id;
        }
            this.baseUrl = 'http://korshundev.zzz.com.ua/calendar/api/';
        this.headers = {
            Authorization: null,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        if (Boolean(this.token)) {
            this.headers.Authorization = `Bearer ${this.token}`;
        }
    }

    getQueryArray = (obj, path = [], result = []) =>
        Object.entries(obj).reduce((acc, [k, v]) => {
            path.push(k);

            if (v instanceof Object) {
                this.getQueryArray(v, path, acc);
            } else {
                acc.push(`${path.map((n, i) => i ? `[${n}]` : n).join('')}=${v}`);
            }

            path.pop();

            return acc;
        }, result);

    async handleErrors(response) {
        const {errors} = response;
        if (errors) {
            throw new ApiError({
                message: errors,
            })
        }
    }

    async register(data) {
        data['action'] = 'addUser';
        const response = await fetch(`${this.baseUrl}?` + this.getQueryArray(data).join('&'), {
            user: '',
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(data),
        });
        const user = await response.json();
        await this.handleErrors(user);
        this.headers.Authorization = `Bearer ${user.token}`;
        localStorage.setItem('data', JSON.stringify(user));
        this.token = user.token;
        return user
    }

    async login(data) {
        data['action'] = 'checkUser';
        const response = await fetch(`${this.baseUrl}?` + this.getQueryArray(data).join('&'), {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(data),
        });
        const user = await response.json();
        await this.handleErrors(user);
        this.headers.Authorization = `Bearer ${user.token}`;
        localStorage.setItem('data', JSON.stringify(user));
        this.token = user.token;
        return user
    }

    async getCalendar(data) {
        data['action'] = 'getCalendar';
        data['token'] = this.token;
        data['userId'] = this.userId;
        const response = await fetch(
            `${this.baseUrl}?` + this.getQueryArray(data).join('&'),
            {
                method: "POST",
                body: JSON.stringify({}),
                headers: this.headers,
            }
        );
        const res = await response.json();
        await this.handleErrors(response);
        return res.items;
    }

    async addCalendar(data) {
        data['action'] = 'addCalendar';
        data['token'] = this.token;
        const response = await fetch(
            `${this.baseUrl}?` + this.getQueryArray(data).join('&'),
            {
                method: "POST",
                body: JSON.stringify({}),
                headers: this.headers,
            }
        );
        const res = await response.json();
        await this.handleErrors(res);
        return res;
    }

    async delCalendar(data) {
        data['action'] = 'delCalendar';
        data['token'] = this.token;
        const response = await fetch(
            `${this.baseUrl}?` + this.getQueryArray(data).join('&'),
            {
                method: "POST",
                body: JSON.stringify({}),
                headers: this.headers,
            }
        );
        const res = await response.json();
        await this.handleErrors(res);
        return res;
    }

    async createTask(data) {
        const {color} = data;
        data['action'] = 'addData';
        data['token'] = this.token;
        data['color'] = encodeURIComponent(color);
        const response = await fetch(
            `${this.baseUrl}?` + this.getQueryArray(data).join('&'),
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: this.headers,
            }
        );
        const res = await response.json();
        await this.handleErrors(res);
        return res;
    }

    async getAllTasks(id) {
        const response = await fetch(`${this.baseUrl}/?action=getData&userId=${id}`, {
            method: "GET",
            headers: this.headers,
        });

        const res = await response.json();
        await this.handleErrors(res);
        const {items} = res;
        return items;
    }

    async editTask(data) {
        const {color} = data;
        data['action'] = 'updateData';
        data['token'] = this.token;
        data['color'] = encodeURIComponent(color);
        const response = await fetch(`${this.baseUrl}?` + this.getQueryArray(data).join('&'), {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: this.headers,
        });
        const res = await response.json();
        await this.handleErrors(res);
        return res;
    }

    async deleteTask(data) {
        data['action'] = 'delData';
        data['token'] = this.token;
        const response = await fetch(`${this.baseUrl}?` + this.getQueryArray(data).join('&'), {
            // action=delData&token=${user.token}&userId=${userId}&id=${id}
            method: "DELETE",
            headers: this.headers,
        });

        const res = await response.json();
        await this.handleErrors(res);
        return res;
    }

    logout() {
        localStorage.removeItem('data');

        console.log(localStorage.removeItem('data'))
    }
}

export const api = new API();