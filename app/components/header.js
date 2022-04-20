import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';

export default Ember.Component.extend({
    /**@service session;*/


    isShowingFilterModal: false,
    isShowingSearchModal: false,

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
        }
    }
})