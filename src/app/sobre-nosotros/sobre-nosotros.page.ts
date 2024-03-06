import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import * as L from 'leaflet';


@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.page.html',
  styleUrls: ['./sobre-nosotros.page.scss'],
})
export class SobreNosotrosPage implements OnInit {
map: any;
  constructor(private callNumber:CallNumber) { }

  ngOnInit() {
  }
  ionViewDidLoad(){
    this.loadMap();
  }
  llamadita(){
  this.callNumber.callNumber('697667252', true)
  .then(() => console.log('Llamada iniciada'))
  .catch(e => console.log('Error al iniciar la llamada', e));
  }
  loadMap(){
    let latitud = 36.6797047;
    let longitud = -5.4470656;
    let zoom = 17;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);
  }
}
