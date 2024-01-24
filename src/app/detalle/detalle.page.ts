import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Pelicula } from '../pelicula';
import { Router } from '@angular/router';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = "";
  document: any = {
    id: "",
    data: {} as Pelicula
  };
  existePeli: boolean = true;
  public alertButtons = [
    {
       text: 'Cancelar',
       role:'cancel',
       handler: () => {
         console.log('Cancelación de borrado');
       },
    },
    {
       text: 'Borrar',
       role: 'confirm',
       handler: () => {
         console.log('Pelicula borrada correctamente');
         this.clickBotonBorrar();
       }
    }
   ];
   

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) { 
  }

  ngOnInit() {
    let idDetalle = this.activatedRoute.snapshot.paramMap.get('id');
    if(idDetalle != null){
      this.id = idDetalle;
      this.obtenerDetalles();
    } else{
      this.id = "";
    }
    
  }

  obtenerDetalles(){
    // Consultamos a la base de datos para obtener los datos asociados al id
    this.firestoreService.consultarPorId("peliculas",this.id).subscribe((resultado:any)=>{
      // Preguntar si se encuentra un document con ese ID
      if(resultado.payload.data() != null){
        this.document.id = resultado.payload.id;
        this.document.data = resultado.payload.data();
        this.existePeli = true;
      } else {
        // No se ha encontrado un document con ese Id. Vaciamos los datos que hubiera
        this.document.data = {} as Pelicula;
        this.existePeli = false;
      }
    });
  }
  clickBotonInsertar(){
    this.firestoreService.insertar("peliculas",this.document.data).then(() => {
      console.log('Pelicula creada correctamente');
      this.document.data = {} as Pelicula;
      this.router.navigate(['home']);
    },(error)=>{
      console.error(error);
    });
  }
  clickBotonBorrar(){
    this.firestoreService.borrar("peliculas",this.id).then(() => {
      console.log('Pelicula borrada correctamente');
      this.document.data={} as Pelicula;
      this.id = "";
      this.router.navigate(['home']);
    },(error)=>{
      console.error(error);
    });
  }
  clickBotonModificar(){
    this.firestoreService.modificar("peliculas",this.id,this.document.data).then(() => {
      console.log('Pelicula modificada correctamente');
      this.router.navigate(['home']);
    },(error)=>{
      console.error(error);
    });
  }

}
