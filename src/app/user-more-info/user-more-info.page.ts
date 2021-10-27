import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-user-more-info',
  templateUrl: './user-more-info.page.html',
  styleUrls: ['./user-more-info.page.scss'],
})
export class UserMoreInfoPage implements OnInit {
  userForm: FormGroup;
  errorMsg: string = '';
  successMsg: string = '';
  error_msg = {
    'name': [
      { 
        type: 'required', 
        message: 'First name is required.' 
      },
      { 
        type: 'pattern', 
        message: 'First name is not valid.' 
      }
    ],
    'lastname': [
      { 
        type: 'required', 
        message: 'Provide lastname.' 
      },
      { 
        type: 'pattern', 
        message: 'Last name is not valid.' 
      }
    ],
    'idnumber': [
      { 
        type: 'required', 
        message: 'Provide ID.' 
      },
      { 
        type: 'pattern', 
        message: 'ID is not valid.' 
      }
    ],
    'cellphone': [
      { 
        type: 'required', 
        message: 'Provide cellphone.' 
      },
      { 
        type: 'pattern', 
        message: 'cellphone is not valid.' 
      }
    ],
    'address': [
      { 
        type: 'required', 
        message: 'Provide an address.' 
      },
      { 
        type: 'pattern', 
        message: 'address is not valid.' 
      }
    ],

  };
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router) {
   }

  ngOnInit() {
    const email = localStorage.getItem('userEmail');
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      idnumber: ['', Validators.required],
      lastname: ['', Validators.required],
      cellphone: ['', Validators.required],
    });
    this.userForm.controls['email'].setValue(email);
  }

  register(value) {
    this.authService.registerUser(value)
    .then(async (response) => {
        const toast = await this.toastController.create({
          message: 'Created successfully!',
          duration: 2000,
        });
        toast.present();
        this.router.navigateByUrl('home');
      }, error => {
        this.errorMsg = error.message;
        this.successMsg = "";
      });
  }
}
