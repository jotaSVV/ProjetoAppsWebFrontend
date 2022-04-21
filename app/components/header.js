import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';

export default Ember.Component.extend({
    /**@service session;**/


    isShowingFilterModal: false,
    isShowingSearchModal: false,
    active: false,

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
        openSelect(){
            this.toggleProperty('active')
            console.warn(this.get('#modal-overlays .modal-filter .dropdown .dropdown-menu'))
            console.warn(Ember.$('#modal-overlays .modal-filter .dropdown .dropdown-menu').find('.dropdown-menu'))
        }

    }
})

/* Dropdown Menu
$('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});
$('.dropdown .dropdown-menu li').click(function () {
    $(this).parents('.dropdown').find('span').text($(this).text());
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});

$('.dropdown-menu li').click(function () {
  var input = '<strong>' + $(this).parents('.dropdown').find('input').val() + '</strong>',
  msg = '<span class="msg">Hidden input value: ';
  $('.msg').html(msg + input + '</span>');
});*/