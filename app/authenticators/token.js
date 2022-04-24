import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
    async restore(data) {
        let { token } = data;
        if (token) {
            return data;
        } else {
            throw 'no valid session data';
        }
    },

    async authenticate(username, password) {
        // let response = await fetch('http://localhost:8081/api/v1/auth/login', {
        let response = await fetch('http://gobackendufp.herokuapp.com/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (response.ok) {
            let json = await response.json();
            return json;
        } else {
            let error = await response.json();
            throw new Error(error.message);
        }
    },

    invalidate(data) {},
});