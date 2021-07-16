export function getMsgError(code:string,args?:any,provider?:string){
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
    case 'auth/popup-closed-by-user':{
      return `Has cerrado la ventana de autenticación de ${provider}`
    }
    case 'auth/account-exists-with-different-credential':{
      return `Ya existe una cuenta con este correo electronico (${args.email}), inicia sesión con esa cuenta`
    }
    default:{
      return 'Ocurrió un error'
    }
  }
}
