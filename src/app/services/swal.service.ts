import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon,SweetAlertOptions } from 'sweetalert2';
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

  alertErrorLogin(title:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    })

    Toast.fire({
      icon:'error',
      title
    });
  }

  async emailModal(){
    const { value: email } = await Swal.fire({
      title: 'Ingresa tu correo electrónico.',
      input: 'email',
      inputPlaceholder: 'Correo electrónico',
      confirmButtonText:'Aceptar',
      confirmButtonColor:'#FFA66D'
    })

    return email;
  }
}
