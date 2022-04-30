import Ember from 'ember';
import { inject } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export class UserLocation {
  @tracked username;
  @tracked lat;
  @tracked lng;

  constructor({ username, lat, lng }) {
    this.username = username;
    this.lat = lat;
    this.lng = lng;
  }

  getLocation() {
    return [this.lat, this.lng];
  }
}

export default Ember.Component.extend({
  lat: 41.1579438,
  lng: -8.6291053,
  zoom: 16,
  session: inject('session'),
  marker: inject('markers'),
  isUserLocation: false,
  user: UserLocation,
  emberConfLocation: [41.1579438, -8.6291053],
  userName: '',
  async init() {
    this._super(...arguments);

    let response = await fetch(
      'http://gobackendufp.herokuapp.com/api/v1/position/',
      {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          'Content-Type': 'application/json',
          Authorization: `${this.session.data.authenticated.token}`,
        },
      }
    );
    if (response.ok) {
      let data = await response.json();
      this.user = new UserLocation({
        username: this.session.data.authenticated.User.username,
        lat: data.location.Latitude,
        lng: data.location.Longitude,
      });
      this.emberConfLocation = this.user.getLocation();
      this.set('isUserLocation', true);
    } else {
      let error = response.json();
      throw new Error(error.message);
    }
  },
  actions: {
    async newPosition(e) {
      let { lat, lng } = e.target.getCenter();
      let response = await fetch(
        'http://gobackendufp.herokuapp.com/api/v1/position/',
        {
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
              'HEAD, GET, POST, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers':
              'Origin, Content-Type, X-Auth-Token',
            'Content-Type': 'application/json',
            Authorization: `${this.session.data.authenticated.token}`,
          },
          body: JSON.stringify({
            Latitude: lat,
            Longitude: lng,
          }),
        }
      );

      if (response.ok) {
        this.user = new UserLocation({
          username: this.session.data.authenticated.User.username,
          lat: lat,
          lng: lng,
        });
        this.set('emberConfLocation', this.user.getLocation());
      } else {
        this.user = new UserLocation({
          username: this.session.data.authenticated.User.username,
          lat: lat,
          lng: lng,
        });
        this.set('emberConfLocation', this.user.getLocation());
      }
    },
  },
});
