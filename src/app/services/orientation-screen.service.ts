import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrientationScreenService {

  private orientation:BehaviorSubject<string> = new BehaviorSubject<string>('portrait');
  orientation$ = this.orientation.asObservable();
  constructor(private deviceDetectorService: DeviceDetectorService) {
    this.detectOrientacion();
  }

  detectOrientacion(){
    if(!this.deviceDetectorService.isDesktop()){
      if(screen.availHeight>screen.availWidth){
        this.orientation.next('portrait');
        document.body.style.overflow='auto';
      }else{
        this.orientation.next('landscape');
        document.body.style.overflow='hidden';
      }
    }
  }
}
