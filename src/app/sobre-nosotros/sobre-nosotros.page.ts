import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import * as L from 'leaflet';


@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.page.html',
  styleUrls: ['./sobre-nosotros.page.scss'],
})
export class SobreNosotrosPage implements OnInit {
map: L.Map;
  constructor(private callNumber:CallNumber) { 
    this.map = {} as L.Map;
  }

  ngOnInit() {
  }
  ionViewDidEnter(){
    this.loadMap();
  }
  llamadita(){
  this.callNumber.callNumber('697667252', true)
  .then(() => console.log('Llamada iniciada'))
  .catch(e => console.log('Error al iniciar la llamada', e));
  }
  loadMap(){
    let latitud = 36.6502006;
    let longitud = -6.1277114;
    let zoom = 17;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    this.map.dragging.enable();
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);
    L.marker([latitud,longitud]).addTo(this.map);
  }
}
