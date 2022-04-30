import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MarkerService extends Service {
  @tracked sos = false;

  changeSosState() {
    this.sos = !this.sos;
  }
}