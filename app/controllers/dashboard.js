import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class DashboardController extends Controller {
    @service session;

    beforeModel(transition) {
        this.session.requireAuthentication(transition, 'login');
    }
}
