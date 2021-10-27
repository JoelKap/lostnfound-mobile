import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
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
  constructor(private authService: AuthService, 
    private router: Router, 
    private fb: FormBuilder,
    public loadingController: LoadingController,
    private toastController: ToastController) { }

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

  async register(value) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    this.authService.register(value)
    .then(async (response) => {
      loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Created successfully!',
          duration: 2000,
        });
        toast.present();
        this.router.navigateByUrl('login');
      }, error => {
        this.errorMsg = error.message;
        this.successMsg = "";
      });
  }

  goToLogin() {
    this.router.navigateByUrl('login');
  }
}
