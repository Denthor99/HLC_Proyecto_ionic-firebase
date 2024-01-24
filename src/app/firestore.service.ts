import { Injectable } from '@angular/core';

import {AngularFirestore} from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) {

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
}