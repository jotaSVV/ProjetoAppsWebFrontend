import Ember from 'ember';
import { inject } from '@ember/service';

export default Ember.Component.extend({
  session: inject('session'),
  isShowingFilterModal: false,
  isShowingSearchModal: false,
  active: false,
  selectUser: false,
  showFollowers: false,
  showAllUsers: false,
  isRightBarOpen: false,
  usersData: [],
  isSosActive:false,
  text: 'Escolha utizador(es)',

  actions: {
    openFilterModal() {
      this.set('isShowingFilterModal', !this.isShowingFilterModal);
    },
    openSearchModal() {
      this.set('isShowingSearchModal', !this.isShowingSearchModal);
    },
    logout() {
      // RouterService.transitionTo('login');
      this.session.invalidate();
      // let response = await fetch('http://localhost:8081/api/v1/auth/logout', {
      //     method: 'POST',
      //     headers: {
      //         'Access-Control-Allow-Origin': '*',
      //         'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
      //         'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      //         'Content-Type': 'application/json',
      //       },
      // });
      // if (response.ok) {
      //     this.session.invalidate();
      //     this.transitionToRoute('login');
      //     return await response.json();
      // } else {
      //     let error = await response.json();
      //     throw new Error(error.message);
      // }
    },
    openSelect() {
      this.set('selectUser', true);
    },
    closeSelect() {
      this.set('selectUser', false);
    },
    selectValue(attr) {
      this.set('selectUser', false);
      this.set('text', attr);
    },
    openRightBar() {
      this.set('isRightBarOpen', !this.isRightBarOpen);
      if(this.isRightBarOpen)
        document.getElementById("map").classList.add("overlay");
      else
        document.getElementById("map").classList.remove("overlay");
    },
    closeRightBar() {
      this.set('isRightBarOpen', false);
      document.getElementById("map").classList.remove("overlay");
    },
    async getAllUsers() {
      let response = await fetch(
        'http://gobackendufp.herokuapp.com/api/v1/user/getAll',
        {
          method: 'GET',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
              'HEAD, GET, POST, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers':
              'Origin, Content-Type, X-Auth-Token',
            'Content-Type': 'application/json',
            Authorization: `${this.session.data.authenticated.token}`,
          },
        }
      );
      if (response.ok) {
        let data = await response.json();
        this.set('usersData', data.data);
        this.set('showFollowers', false);
        this.set('showAllUsers', true);
      } else {
        let error = response.json();
        throw new Error(error.message);
      }
    },
    async getAllFollowers() {
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
        this.set('usersData', data.data);
        this.set('showFollowers', true);
        this.set('showAllUsers', false);
      } else {
        let error = response.json();
        throw new Error(error.message);
      }
    },
    sos(){
        if(!this.isSosActive){
            this.set('isSosActive',true);          
        }else{
            this.set('isSosActive',false);
        }
    }
  },
});
