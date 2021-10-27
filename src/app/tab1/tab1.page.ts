import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { LostItemService } from '../service/lost-item.service';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/compat/storage';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  term = '';
  photo: any;
  pipe = new DatePipe('en-US')
  lostDocs: any[] = [];
  selectedDoc: any = {};
  constructor(
    // private androidPermissions: AndroidPermissions,
    private storage: AngularFireStorage,
    private platform: Platform,
    private toastController: ToastController,
    // private camera: Camera,
    private navCtrl: NavController,
    private router: Router,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private lostServ: LostItemService) { 
      this.platform.ready().then(() => {

        // androidPermissions.requestPermissions(
        //   [
        //     androidPermissions.PERMISSION.CAMERA,
        //     androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
        //     androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        //   ]
        // );

   }) 
    }

  async ngOnInit(): Promise<void> {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    this.lostServ.getLostDocs().subscribe((resp) => {
      loading.dismiss();
      this.lostDocs.length = 0;
      if (resp.length) {
        this.lostDocs.push.apply(this.lostDocs, resp);
      }
    })
  }

  async addDoc() {
    const type = 'add';
    this.lostServ.checkIfUserProfile(localStorage.getItem('userEmail'), type, undefined);
  }

  async viewDoc(document: any) {
    this.selectedDoc = document;
    return new Promise((resolve, reject) => {
      const dateFound = this.pipe.transform(document.dateFound, 'short')
      this.alertController
        .create({
          header: document.documentType,
          message: `Firstname: ${document.firstname}, 
          Lastname: ${document.lastname}, 
          Description: ${document.description},
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
              handler: () => resolve(this.takePicture(document))
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

  updateFoundDocument(val) {
    const type = 'found';
    if (val) {
      this.lostServ.checkIfUserProfile(localStorage.getItem('userEmail'), type, this.selectedDoc)
    }
    return;
  }

  async takePicture(document: any) {
    if (document) {
      try {
        debugger;
        // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA)
        //   .then(async result => {
        //     if (!result.hasPermission) {
        //       this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then((cam) => {
        //         this.initializePreview(document)
        //       })
        //     } else {
        //       this.initializePreview(document);
        //     }
        //   },
        //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        //   );
       // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
      } catch (e) {
        const toast = await this.toastController.create({
          message: e,
          duration: 2000,
        });
        toast.present();
      }
    }
  }

  async initializePreview(document) {
    const toast = await this.toastController.create({
      message: 'will preview soon',
      duration: 2000,
    });
    toast.present();
    // const options: CameraOptions = {
    //   quality: 50,
    //   targetHeight: 600,
    //   targetWidth: 600,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   sourceType: this.camera.PictureSourceType.CAMERA,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   correctOrientation: true
    // }
    // this.camera.getPicture(options).then(async (imageData) => {
    //   const toast = await this.toastController.create({
    //     message: 'inside camera mode',
    //     duration: 2000,
    //   });
    //   toast.present();
    //   this.photo = `data:image/jpeg;base64,${imageData}`;
    //   var uploadTask = this.storage.ref(`pictures/${document.id}`);
    //   uploadTask.putString(this.photo, 'data_url');
    // });
  }
}
