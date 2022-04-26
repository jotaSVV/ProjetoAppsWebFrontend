import Ember from 'ember';
import { inject } from '@ember/service';
export default Ember.Component.extend({
    session: inject('session'),

    actions:{
        async addFollower(id){
            let response = await fetch(
                'http://gobackendufp.herokuapp.com/api/v1/follower/assoc',
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
                return await response.json();
              } else {
                let error = await response.json();
                throw new Error(error.message);
              }
        },
    }
})