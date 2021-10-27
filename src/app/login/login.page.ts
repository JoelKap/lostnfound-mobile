import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userForm: FormGroup;
  successMsg: string = '';
  errorMsg: string = '';
  
  error_msg = {
    'email': [
      { 
        type: 'required', 
        message: 'Provide email.' 
      },
      { 
        type: 'pattern', 
        message: 'Email is not valid.' 
      }
    ],
    'password': [
      { 
        type: 'required', 
        message: 'Password is required.' 
      },
      { 
        type: 'minlength', 
        message: 'Password length should be 6 characters long.' 
      }
    ]
  };
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    public loadingController: LoadingController,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  async signIn(value) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    this.authService.signinUser(value)
      .then((response) => {
        loading.dismiss();
        const usermail = response.user._delegate.email;
        localStorage.setItem('userEmail', usermail);
        this.errorMsg = "";
        this.router.navigateByUrl('tabs');
      }, async error => {
        this.successMsg = "";
        const toast = await this.toastController.create({
          message: 'this.errorMsg',
          duration: 2000,
        });
        toast.present();
      })
  }

  goToSignup() {
    this.router.navigateByUrl('registration');
  }
}
