import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {AngularFirestore} from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore,private angularFireStorage: AngularFireStorage) {

   }

  // Insertar elemento en una colección
  public insertar(coleccion: any,datos: any){
    return this.angularFirestore.collection(coleccion).add(datos);

  }

  // Consulta
  public consultar (coleccion:string){
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  // Borrar
  public borrar(coleccion:string, documentId:string){
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  // Actualizar
  public modificar(coleccion:string, documentId:string,datos:any){
    return this.angularFirestore.collection(coleccion).doc(documentId).set(datos);
  }

  // Consulta por id
  public consultarPorId(coleccion:string,documentId:string){
    return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
  }

  // Subir imagen  a Firebase Storage y guardar el link en Firestore
  public subirImagenBase64(nombreCarpeta:string, nombreArchivo:string, imagenBase64:string){
    let storageRef = this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString(imagenBase64, 'data_url');
  }

  // Eliminar  archivo de Firebase Storage
  public eliminarArchivoPorUrl(url:string){
    return this.angularFireStorage.storage.refFromURL(url).delete();
  }
}