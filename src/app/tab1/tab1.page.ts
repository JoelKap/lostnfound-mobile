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
  selectedDoc: any = {};
  constructor(
    public firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private platform: Platform,
    private toastController: ToastController,
    private camera: Camera,
    private navCtrl: NavController,
    private router: Router,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private authService: AuthenticationService,
    private lostServ: LostItemService) { }

  ngOnDestroy(): void {
    this.docs$.unsubscribe()
  }

  async ngOnInit(): Promise<void> {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    // this.lostServ.getLostDocs().subscribe((resp) => {
    //   loading.dismiss();
    //   this.lostDocs.length = 0;
    //   let lostDocsLodash = [];
    //   if (resp.length) {
    //     debugger;
    //     lostDocsLodash = _.orderBy(resp, ['createdAt'], ['asc', 'desc']);
    //     this.lostDocs.push.apply(this.lostDocs, lostDocsLodash);
    //     loading.dismiss();
    //     debugger;
    //     this.lostDocs.forEach((doc: any) => {
    //       this.storage.ref(`/documentFiles/${doc.id}`).getDownloadURL().toPromise().then((url) => {
    //         if (url) {
    //           doc.imageUrl = url;
    //         }
    //       });
    //     })
    //   }
    // })

    this.docs$ = this.lostServ.getLostDocs();
    this.docs$.forEach((doc) => {
      loading.dismiss();
      this.lostDocs.length = 0;
      let lostDocsLodash = [];
      lostDocsLodash = _.orderBy(doc, ['createdAt'], ['asc', 'desc']);
      this.lostDocs.push.apply(this.lostDocs, lostDocsLodash);
      // this.lostDocs.push(doc);
      //const selectedDoc = this.lostDocs.find(doc);
      this.lostDocs.forEach((resp) => {
        this.storage.ref(`/documentFiles/${resp.id}`).getDownloadURL().toPromise().then((url) => {
          if (url) {
            resp.imageUrl = url;
          }
        });
      })
    })
    // if (this.lostDocs.length) {
    //   debugger;
    //   let lostDocsLodash = [];
    //   lostDocsLodash = _.orderBy(this.lostDocs, ['createdAt'], ['asc', 'desc']);
    //   this.lostDocs.push.apply(this.lostDocs, lostDocsLodash);
    //   this.lostDocs.forEach((doc: any) => {
    //     this.storage.ref(`/documentFiles/${doc.id}`).getDownloadURL().toPromise().then((url) => {
    //       if (url) {
    //         doc.imageUrl = url;
    //       }
    //     });
    //   }
    // docs$.map(questions => questions.map((question) => {
    //   debugger;
    // }))
    // debugger;
    // loading.dismiss();
    // this.lostDocs.length = 0;
    // let lostDocsLodash = [];
    // if (docs$) {
    //   debugger;
    //   lostDocsLodash = _.orderBy(docs$, ['createdAt'], ['asc', 'desc']);
    //   this.lostDocs.push.apply(this.lostDocs, lostDocsLodash);
    //   loading.dismiss();
    //   debugger;
    //   this.lostDocs.forEach((doc: any) => {
    //     this.storage.ref(`/documentFiles/${doc.id}`).getDownloadURL().toPromise().then((url) => {
    //       if (url) {
    //         doc.imageUrl = url;
    //       }
    //     });
    //   })
    // }
    //   )
    // }
  }

  async addDoc() {
    debugger;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    const type = 'add';

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
                    handler: () => resolve(),
                  }
                ]
              })
              .then(alert => {
                this.navCtrl.navigateForward(['user-more-info']);
                // this.router.navigateByUrl('user-more-info')
                alert.present();
              });
          });
        }
      })

    //this.lostServ.checkIfUserProfile(localStorage.getItem('userEmail'), type, undefined).then((resp) => {
    //   loading.dismiss();
    //   if (resp === 'add') {
    //     debugger;
    //     return this.router.navigateByUrl('/add-lost-item');
    //   }
    // });
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
