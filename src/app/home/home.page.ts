import { Component } from '@angular/core';
import { Pelicula } from '../pelicula';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  peliculaEditando = {} as Pelicula;
  
  // Arra
  arrayColeccionPeliculas:any = [{
    id: "",
    pelicula: {} as Pelicula
  }];

  // id de la  tarea seleccionada
  idPeliculaSelec: string = "";

  constructor(private firestoreService: FirestoreService, private router: Router) {
    this.obtenerListaPeliculas();
  }


  obtenerListaPeliculas(){
    // Hacer una consulta cada vez que se detecten nuevos datos en la BBDD
    this.firestoreService.consultar("peliculas").subscribe((datosRecibidos)=>{
      this.arrayColeccionPeliculas = []; // Vaciamos el array para evitar duplicación de peliculas
      // Recorremos todos los datos recibidos de la Base de Datos
      datosRecibidos.forEach((datosPelicula)=>{
        // Cada elemento de la BBDD se almacena en el array que se muestra en pantalla
        this.arrayColeccionPeliculas.push({
          id: datosPelicula.payload.doc.id,
          pelicula: datosPelicula.payload.doc.data()
        });
      });
    });
  }

  selecPelicula(idPelicula: string, peliculaSelec:Pelicula){
    this.peliculaEditando = peliculaSelec;
    this.idPeliculaSelec = idPelicula;
    this.router.navigate(['detalle',this.idPeliculaSelec]);
  }

  

  clickBotonAddPeli(){
    this.router.navigate(['detalle','nuevo']);
  }

}