import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;

  @computed('session.data.authenticated.token')
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      headers['token'] = `Token ${this.session.data.authenticated.token}`;
    }
    return headers;
  }
}
