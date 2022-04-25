import Ember from 'ember';
import { inject } from '@ember/service';

export default Ember.Component.extend({
    session: inject('session'),
    isShowingFilterModal: false,
    isShowingSearchModal: false,
    active: false,
    selectUser: false,
    text: "Escolha utizador(es)",

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
            console.warn(attr)
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