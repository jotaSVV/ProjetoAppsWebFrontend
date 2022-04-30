import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

class Marker {
  latitude;
  longitude;
  text;

  constructor(marker) {
    this.latitude = marker.latitude;
    this.longitude = marker.longitude;
    this.text = marker.text;
  }
}
export default class MarkerService extends Service {
  @tracked markersList = [];

  addItem(marker, data) {
    this.markersList = [...this.markersList, new Marker({
      latitude: marker[0],
      longitude: marker[1],
      text: data,
    })];
  }
}