import { Injectable } from '@angular/core';
import { AuthHttp } from '../http/auth.http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AuthHttp) { }

  register(value: any) {
    return this.auth.register(value);
  }

  signinUser(value: any) {
    return this.auth.signinUser(value);
  }

  registerUser(value: any) {
    return this.auth.registerUser(value);
  }
}
