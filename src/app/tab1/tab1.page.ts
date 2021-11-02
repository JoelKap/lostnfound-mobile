import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { LostItemService } from '../service/lost-item.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AuthenticationService } from '../services/authentication.service';
import * as _ from 'lodash';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc } from 'firebase/firestore';
import { async, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {
  docs$: any;
  term = '';
  photo: any;
  pipe = new DatePipe('en-US')
  lostDocs: any[] = [];
  lostDocsLodash: any[] = [];
  selectedDoc: any = {};
  constructor(
    public firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private navCtrl: NavController,
    private router: Router,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private authService: AuthenticationService,
    private lostServ: LostItemService) { }

  ngOnDestroy(): void {
    //  this.docs$.unsubscribe()
  }

  async ngOnInit(): Promise<void> {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    this.docs$ = this.lostServ.getLostDocs();
    this.docs$.forEach((docs) => {
      loading.dismiss();
      let arr = [];
      this.lostDocs.length = 0;
      this.lostDocsLodash.length = 0;
      arr = docs;
      arr.forEach((doc) => {
        this.storage.ref(`/documentFiles/${doc.id}`).getDownloadURL().toPromise().then((url) => {
          if (url) {
            doc.imageUrl = url;
          }
        });
      })
      this.lostDocsLodash = _.orderBy(arr, ['createdAt'], ['desc']);
      this.lostDocs.push.apply(this.lostDocs, this.lostDocsLodash);
    })
  }

  async addDoc() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    this.firestore.collection('users', (ref) => ref
      .where('email', '==', localStorage.getItem('userEmail'))
      .limit(1))
      .get()
      .subscribe(async (user) => {
        if (user.size > 0) {
          return this.router.navigateByUrl('/add-lost-item');
        } else {
          return new Promise((resolve, reject) => {
            this.alertController
              .create({
                header: 'User Profile',
                message: 'It appears we needs more of your info, Please click ok to proceed',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => resolve(this.navigateTo()),
                  }
                ]
              })
              .then(alert => {
                alert.present();
              });
          });
        }
      })
  }

  navigateTo() {
    this.router.navigateByUrl('/user-more-info');
  }

  async viewDoc(document: any) {
    this.selectedDoc = document;
    return new Promise((resolve, reject) => {
      const dateFound = this.pipe.transform(document.dateFound, 'short')
      this.alertController
        .create({
          header: document.documentType,
          message:
            `Firstname: ${document.firstname} 
          Lastname: ${document.lastname} 
          Description: ${document.description}
          Date found: ${dateFound}`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'primary',
              handler: () => reject(this.updateFoundDocument(false))
            },
            {
              text: 'Pictures',
              role: 'Pictures',
              cssClass: 'secondary',
              handler: () => resolve(this.viewPicture(document))
            },
            {
              text: 'Found',
              handler: () => resolve(this.updateFoundDocument(true))
            }
          ]
        })
        .then(alert => {
          alert.present();
        });
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  updateFoundDocument(val) {
    const type = 'found';
    if (val) {
      this.lostServ.checkIfUserProfile(localStorage.getItem('userEmail'), type, this.selectedDoc)
    }
    return;
  }

  async viewPicture(document: any) {
    if (document) {
      localStorage.setItem('id', document.id);
      this.navCtrl.navigateForward(['view-picture']);
    }
  }
}
