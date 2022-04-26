import Ember from 'ember';
import { inject } from '@ember/service';

export default Ember.Component.extend({
    session: inject('session'),

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
        async getUserLocation(id){ // ENDPOINT NÃO FOI FEITO NO BACKEND
            console.log('Getting user location');
        }
    }
})