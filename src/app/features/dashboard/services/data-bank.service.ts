import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataBankService {

  private dataBank: any[] = [];

  constructor() {}

  // Agregar un objeto al array
  addObject(obj: any): void {
    this.dataBank.push(obj);
  }

  // Obtener todos los objetos del array
  getObjects(): any[] {
    return this.dataBank;
  }

  // Obtener un objeto por índice
  getObject(index: number): any {
    return this.dataBank[index];
  }

  // Actualizar un objeto en el array por índice
  updateObject(index: number, newObj: any): void {
    if (index >= 0 && index < this.dataBank.length) {
      this.dataBank[index] = newObj;
    }
  }

  // Eliminar un objeto del array por índice
  deleteObject(index: number): void {
    if (index >= 0 && index < this.dataBank.length) {
      this.dataBank.splice(index, 1);
    }
  }

}
