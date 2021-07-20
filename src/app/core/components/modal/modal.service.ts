import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  // confirmButton:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  confirmButton$ :Observable<any>;
  confirmButton:HTMLElement;
  cancelButton:HTMLElement;
  constructor() { }

  ok(button:ElementRef){
    this.confirmButton$ = fromEvent(button.nativeElement,'click');
  }

  openModal(){
    this.confirmButton.click();
  }

  closeModal(){
    this.cancelButton.click();
  }
}
