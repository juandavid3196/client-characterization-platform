import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private eventSubject = new Subject<any>();

  // Observable para que los componentes puedan suscribirse a los eventos
  event$ = this.eventSubject.asObservable();

  // Método para emitir eventos
  emit(eventName: string, data?: any) {
    this.eventSubject.next({ eventName, data });
  }
}
