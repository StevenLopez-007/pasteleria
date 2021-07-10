export function getMsgError(code:string){
  switch(code){
    case 'auth/wrong-password':{
      return 'Correo ó contraseña incorrecta'
    }
    case 'auth/user-not-found':{
      return 'Correo ó contraseña incorrecta'
    }
    case 'auth/too-many-requests':{
      return 'Has ingreso muchas veces una contraseña incorrecta, vuelve a intentarlo más tarde.'
    }
    case 'auth/email-already-exists':{
      return 'Este correo ya fue utilizado'
    }
    case 'auth/invalid-email':{
      return 'Ingresa un E-mail válido.'
    }
    default:{
      return 'Ocurrió un error'
    }
  }
}
