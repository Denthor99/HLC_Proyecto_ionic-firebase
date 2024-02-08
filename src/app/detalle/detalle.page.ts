import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Pelicula } from '../pelicula';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

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
  imagenSelec: string ="";
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
   

  constructor(private activatedRoute: ActivatedRoute, 
    private firestoreService: FirestoreService, 
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker) { }

  ngOnInit() {
    let idDetalle = this.activatedRoute.snapshot.paramMap.get('id');
    if(idDetalle != null){
      this.id = idDetalle;
      this.obtenerDetalles();
    } else{
      this.id = "";
    }
    
  }

  async subirImagenYPelicula() {
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Subiendo imagen...',
    });
    // Mostrar el mensaje de espera
    loading.present();
  
    // Carpeta donde se guardará la imagen
    let nombreCarpeta = 'imagenes';
  
    // Asignar el nombre de la imagen en función de la hora actual, para evitar duplicados
    let nombreImagen = `${new Date().getTime()}`;
  
    try {
      // Llamar al método que sube la imagen al Storage
      const snapshot = await this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelec);
      const downloadURL = await snapshot.ref.getDownloadURL();
      
      // Asignar la URL de descarga de la imagen a la estructura de datos de la película
      this.document.data.imagenURL = downloadURL;
  
      // Mensaje de finalización de subida
      const toast = await this.toastController.create({
        message: 'Imagen subida correctamente',
        duration:  3000,
      });
      toast.present();
  
      // Insertar la información de la película después de subir la imagen
      await this.firestoreService.insertar("peliculas", this.document.data);
      console.log('Película creada correctamente');
      this.document.data = {} as Pelicula;
      this.router.navigate(['home']);
    } catch (error) {
      console.error(error);
    } finally {
      // Ocultar mensaje de espera
      loading.dismiss();
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

  async seleccionarImagen(){
    //  Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
        } else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1, // Permitir solo una imagen
            outputType: 1 // Base64
          }).then(
            (results) => { // En la variable results se tienen las imágenes seleccionadas
              if(results.length > 0){ // En imagenSelec se almacena la imagen seleccionada
                this.imagenSelec = "data:image/jpeg;base64,"+results[0];
                console.log("Imagen que se ha seleccionado (en Base64): " + this.imagenSelec);
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  async subirImagen() {
    //Mensaje de espera mientras se suba la imagen
    const loading = await this.loadingController.create({
      message: 'Subiendo imagen...',
    });
    //Mensaje de finalización de subida
    const toast = await this.toastController.create({
      message: 'Imagen subida correctamente',
      duration: 3000,
    });

    //Carpeta donde se guardará la imagen
    let nombreCarpeta = 'imagenes';

    //Mostrar el mensaje de espera
    loading.present();

    //Asignar el nombre de la imagen en función de la hora actual, para evitar duplicados
    let nombreImagen = `${new Date().getTime()}`;
    //Llamar al método que sube la imagen al Storage
    this.firestoreService
      .subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelec)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          //Asignar la URL de descarga de la imagen
          console.log('downloadURL: ' + downloadURL);
          //this.document.data.imagenURL = downloadURL;
          toast.present();
          //Ocultar mensaje de espera
          loading.dismiss();
        });
      });
  }

  async eliminarArchivo(fileURL:string){
    const toast = await this.toastController.create({
      message: 'Imagen eliminada correctamente',
      duration: 3000
    });
    this.firestoreService.eliminarArchivoPorUrl(fileURL)
    .then(()=>{
      toast.present();
    }, (err) =>{
      console.error(err);
    });
  }
}
