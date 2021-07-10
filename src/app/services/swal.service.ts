import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }


  mixinSwal(icon:SweetAlertIcon,title:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    })

    Toast.fire({
      icon,
      title
    });
  }
}
