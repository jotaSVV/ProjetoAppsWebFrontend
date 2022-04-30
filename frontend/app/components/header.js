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
  session: inject('session'),
  marker: inject('markers'),
  sos: inject('user'),
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
  isSearchHistory: false,
  isSearchXKm: false,
  usersList:[],
  filterUserID: null,
  user: UserLocation,

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
    async openFilterModal() {
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
        this.usersData = data.data;
      } else {
        let error = response.json();
        throw new Error(error.message);
      }
      this.set('isShowingFilterModal', !this.isShowingFilterModal);
    },
    openSearchModal() {
      this.set('isShowingSearchModal', !this.isShowingSearchModal);
    },
    async logout() {
      let response = await fetch('http://gobackendufp.herokuapp.com/api/v1/auth/logout', {
          method: 'POST',
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
              'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
              'Content-Type': 'application/json',
              Authorization: `${this.session.data.authenticated.token}`,
            },
          body: JSON.stringify({
            username: this.session.username,
          }),
      });
      if (response.ok) {
          let data = await response.json()
          console.log(data)
          this.session.invalidate();
          this.transitionToRoute('login');
          return data;
      } else {
          let error = await response.json();
          throw new Error(error.message);
      }
    },
    openSelect() {
      this.set('selectUser', true);
    },
    closeSelect() {
      this.set('selectUser', false);
    },
    selectValue(attr, id) {
      this.set('selectUser', false);
      this.set('text', attr);
      this.set('filterUserID', id);
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
    async sos(){
        if(!this.isSosActive){
            this.set('isSosActive',true);          
        }else{
            this.set('isSosActive',false);
        }
        this.sos.changeSosState()
        if(this.sos){
          let response = await fetch(
            'http://gobackendufp.herokuapp.com/api/v1/sos/activate',
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
            let data = await response.json()
            console.warn(data)
          }else {
            let error = await response.json();
            throw new Error(error.message);
          }
        }else{
          let response = await fetch(
            'http://gobackendufp.herokuapp.com/api/v1/sos/desactivate',
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
            let data = await response.json()
            console.warn(data)
          }else {
            let error = await response.json();
            throw new Error(error.message);
          }
        }
    },
    userHistory(){
      this.set('isSearchXKm',false);
      this.set('isSearchHistory',true);
      this.set('selectUser', false);
    },
    searchUserXKm(){
        this.set('isSearchXKm',true);
        this.set('isSearchHistory',false);
        this.set('selectUser', false);
    },
    async searchHistory(){
      event.preventDefault();
      let date1 = document.getElementById('date1').value
      let date2 = document.getElementById('date2').value
      if(date1 == '' || date2 == '')
        alert('Por favor insira uma data de inicio e uma data de fim');
      else{
        let response = await fetch(
          'http://gobackendufp.herokuapp.com/api/v1/position/history',
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
              Start: date1,
              End: date2,
            }),
          }
        );
        if (response.ok) {
          let data = await response.json()
          this.marker.markersList = []
          data.locations.forEach((location, key, arr ) => {
              if(Object.is(arr.length - 1, key)) 
                return
              this.marker.addItem([location.Latitude, location.Longitude], "Histórico de Localização")
          })
        } else {
          let error = await response.json();
          throw new Error(error.message);
        }
      }
    },
    async searchXKm(){
      event.preventDefault();
      console.warn(this.user.lat)
      console.warn(this.user.lng)
      let meters = document.getElementById('meters').value
      console.warn(meters)
      if(meters == '')
        alert('Por favor insira uma data de inicio e uma data de fim');
       else{
         let response = await fetch(
           'http://gobackendufp.herokuapp.com/api/v1/position/users_under_xkms',
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
               Latitude: this.user.lat,
               Longitude: this.user.lng,
               Meters: parseFloat(meters),
             }),
           }
         );
         if (response.ok) {
           return await response.json();
         } else {
           let error = await response.json();
           throw new Error(error.message);
         }
     }
    },
    async filterUsers(){
      event.preventDefault();
      let date1 = document.getElementById('filter-date1').value
      let date2 = document.getElementById('filter-date2').value
      this.marker.markersList = []
      if(this.filterUserID == null) 
        this.filterUserID = 0
      
      if(date1 == '' && date2 == ''){
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
              UserId: [this.filterUserID]
            }),
          }
        );
        if (response.ok) {
          var data = await response.json()
          this.marker.markersList = []
          let text = String(this.filterUserID) + ": " + this.text;
          data.locations.forEach((location, key, arr ) => {
              if(Object.is(arr.length - 1, key)) 
                return
              this.marker.addItem([location.Latitude, location.Longitude], text)
          })
          console.warn(data)
          alert('Sucesso, ver localizações no mapa')
        } else {
          let error = await response.json();
          alert("Não foram reportadas localizações para este utilizador/datas");
          throw new Error(error.message);
        }
      }else if(date1 != '' && date2 == ''){
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
              UserId: [this.filterUserID],
              Dates: [date1]
            }),
          }
        );
        if (response.ok) {
          var data = await response.json()
          this.marker.markersList = []
          data.locations.forEach((location, key, arr ) => {
            if(Object.is(arr.length - 1, key)) 
              return
            this.marker.addItem([location.Latitude, location.Longitude], "Histórico de Localização")
          })
          console.warn(data)
          alert('Sucesso, ver localizações no mapa')
        } else {
          let error = await response.json();
          alert("Não foram reportadas localizações para este utilizador/datas");
          throw new Error(error.message);
        }
      }else if(date1 == '' && date2 != ''){
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
              UserId: [this.filterUserID],
              Dates: [date2]
            }),
          }
        );
        if (response.ok) {
          var data = await response.json()
          this.marker.markersList = []
          data.locations.forEach((location, key, arr ) => {
            if(Object.is(arr.length - 1, key)) 
              return
            this.marker.addItem([location.Latitude, location.Longitude], "Histórico de Localização")
          })
          console.warn(data)
          alert('Sucesso, ver localizações no mapa')
        } else {
          let error = await response.json();
          alert("Não foram reportadas localizações para este utilizador/datas");
          throw new Error(error.message);
        }
      }else if(date1 != '' && date2 != ''){
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
              UserId: [this.filterUserID],
              Dates: [date1, date2]
            }),
          }
        );
        if (response.ok) {
          var data = await response.json()
          data.locations.forEach((location, key, arr ) => {
            if(Object.is(arr.length - 1, key)) 
              return
            this.marker.addItem([location.Latitude, location.Longitude], "Histórico de Localização")
          })
          console.warn(data)
          alert('Sucesso, ver localizações no mapa')
        } else {
          let error = await response.json();
          alert("Não foram reportadas localizações para este utilizador/datas");
          throw new Error(error.message);
        }
      }
    }
  }
});
