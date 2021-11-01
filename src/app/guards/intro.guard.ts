import { Injectable } from '@angular/core';
import { CanLoad, Router, RoutesRecognized } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { filter, pairwise } from 'rxjs/operators';

export const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router) { }

  async canLoad(): Promise<boolean> {
    const hasSeenIntro = await Storage.get({ key: TOKEN_KEY });
    if (hasSeenIntro.value !== null) {
      return true;
    } else {
      this.router.navigateByUrl('/intro', { replaceUrl: true });
      return false;
    }
  }

}
