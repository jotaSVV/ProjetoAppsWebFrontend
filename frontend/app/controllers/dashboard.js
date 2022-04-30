import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class DashboardController extends Controller {
  @service session;

  teste() {
    console.warn('teste');
  }

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }
}
