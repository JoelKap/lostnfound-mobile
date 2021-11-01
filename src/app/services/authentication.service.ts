import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';

import { Storage } from '@capacitor/storage';
import { AuthService } from '../service/auth.service';
import { ToastController } from '@ionic/angular';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient,
    private authService: AuthService,
    private toastController: ToastController) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { email, password }): Promise<any> {
   return this.authService.signinUser(credentials)
    .then((response) => {
      const usermail = response.user._delegate.email;
      localStorage.setItem('userEmail', usermail);
      this.isAuthenticated.next(true);
      return from(Storage.set({ key: TOKEN_KEY, value: response.user._delegate.accessToken }));
    }, async error => {
      const toast = await this.toastController.create({
        message: 'incorrect credentials',
        duration: 2000,
      });
      toast.present();
    })
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }
}
