import * as fb from 'firebase';
export interface NewUser{
  username:string,
  newUser:fb.default.auth.UserCredential
}
