import Controller from '@ember/controller';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class RegisterController extends Controller {
    @tracked error;
    @tracked email;
    @tracked password;

    @action
    async register(event) {
        event.preventDefault();
        //let response = await fetch('http://localhost:8081/api/v1/auth/register', {
        let response = await fetch('http://gobackendufp.herokuapp.com/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.username,
                password: this.password,
            }),
        });

        if (response.ok) {
            this.transitionToRoute('login');
            return await response.json();
        } else {
            let error = await response.json();
            throw new Error(error.message);
        }
    }

    @action update(attr, event) {
        this[attr] = event.target.value;
    }

    @action returnLogin() {
        this.transitionToRoute('login');
    }
}