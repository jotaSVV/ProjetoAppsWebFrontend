import Ember from 'ember';
import { inject } from '@ember/service';
import { tracked } from '@glimmer/tracking';

class UserLocation {
    @tracked username;
    @tracked lat;
    @tracked lng;

    constructor({ username, lat, lng }) {
        this.username = username;
        this.lat = lat;
        this.lng = lng;
    }
}

export default Ember.Component.extend({
    lat: 41.1579438,
    lng: -8.6291053,
    zoom: 16,
    session: inject('session'),
    user: UserLocation,
    async init() {
        this._super(...arguments);
        console.warn(this.session)
        console.warn(this.session.data)
        console.warn(this.session.data.authenticated.User)

        let response = await fetch('http://gobackendufp.herokuapp.com/api/v1/position/', {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                'Content-Type': 'application/json',
                'Authorization': `${this.session.data.authenticated.token}`,
            }
        });
        if (response.ok) {
            //console.warn(response.json())
            //  return response.json();
            let data = await response.json()
            user = new UserLocation({
                username: 'Pedro',
                lat: data.location.Latitude,
                lng: data.location.Longitude
            })
            console.warn(user)

        } else {
            console.warn(response.json())

            // let error = response.json();
            //  throw new Error(error.message);
        }
    },
    actions: {
        async newPosition(e) {
            let { lat, lng } = e.target.getCenter();
            let response = await fetch('http://gobackendufp.herokuapp.com/api/v1/position/', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
                    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                    'Content-Type': 'application/json',
                    'Authorization': `${this.session.data.authenticated.token}`,
                },
                body: JSON.stringify({
                    Latitude: lat,
                    Longitude: lng,
                }),
            });

            if (response.ok) {
                console.warn("Sucesso")
                console.warn(response)
                    // this.transitionToRoute('login');
                    // return response.json();
            } else {
                console.warn(response)
                    //let error = response.json();
                    // throw new Error(error.message);
            }
        },
    },
})