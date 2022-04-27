import Ember from 'ember';
import { inject } from '@ember/service';

export default Ember.Component.extend({
    session: inject('session'),
    marker: inject('markers'),

    actions:{
        async removeFollower(id){
            let response = await fetch(
                'http://gobackendufp.herokuapp.com/api/v1/follower/deassoc',
                {
                  method: 'POST',
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
                    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                    'Content-Type': 'application/json',
                    Authorization: `${this.session.data.authenticated.token}`,
                  },
                  body: JSON.stringify({
                    FollowerUserID: id,
                  }),
                }
              );
              if (response.ok) {
                  let response = await fetch(
                    'http://gobackendufp.herokuapp.com/api/v1/follower/',
                    {
                      method: 'GET',
                      headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods':'HEAD, GET, POST, PUT, PATCH, DELETE',
                        'Access-Control-Allow-Headers':'Origin, Content-Type, X-Auth-Token',
                        'Content-Type': 'application/json',
                        Authorization: `${this.session.data.authenticated.token}`,
                      },
                    }
                  );
                  if (response.ok) {
                    let data = await response.json();
                    this.set('data', data.data);
                  } else {
                    let error = response.json();
                    throw new Error(error.message);
                  }
              } else {
                let error = await response.json();
                throw new Error(error.message);
              }
        },
        async getUserLocation(id, name){
            let response = await fetch(
              'http://gobackendufp.herokuapp.com/api/v1/position/filter',
              {
                method: 'POST',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
                  'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                  'Content-Type': 'application/json',
                  Authorization: `${this.session.data.authenticated.token}`,
                },
                body: JSON.stringify({
                  UserId: [id]
                }),
              }
            );
            if (response.ok) {
              var data = await response.json()
              let lastElement = data.locations[data.locations.length - 1];
              this.marker.markersList = []
              let text = String(id) + ": " + name;
              this.marker.addItem([lastElement.Latitude, lastElement.Longitude], text)
            } else {
              let error = await response.json();
              alert("Não foram reportadas localizações para este utilizador");
              throw new Error(error.message);
            }
        }
    }
})