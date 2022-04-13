import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class DashboardController extends Controller {
    @action
    logout() {
        console.warn("Entrei")
    }
}