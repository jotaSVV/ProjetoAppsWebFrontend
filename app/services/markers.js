import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

class Marker {
  latitude;
  longitude;

  constructor(marker) {
    this.latitude = marker.latitude;
    this.longitude = marker.longitude;
  }
}
export default class MarkerService extends Service {
  @tracked markersList = [];

  addItem(marker) {
    this.markersList = [...this.markersList, new Marker({
      latitude: marker[0],
      longitude: marker[1]
    })];
  }
}