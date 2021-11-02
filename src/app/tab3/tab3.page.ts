import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { ActionSheetController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Entry, FileEntry } from '@ionic-native/file/ngx';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as watermark from 'watermarkjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  files = [];
  uploadProgress = 0;

  @ViewChild('previewimage') waterMarkImage: ElementRef;
  originalImage = null;
  blobImage = null;

  constructor(
    public loadingController: LoadingController,
    public firestore: AngularFirestore,
    private http: HttpClient,
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    private media: Media,
    private streamingMedia: StreamingMedia,
    private photoViewer: PhotoViewer,
    private actionSheetController: ActionSheetController,
    private plt: Platform,
    private toastCtrl: ToastController,
    private iab: InAppBrowser,
    private camera: Camera,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.loadUserDocuments();
  }

  captureImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then(async (imageData) => {
      const toast = await this.toastCtrl.create({
        duration: 4000,
        message: `captured image is: ${imageData}`
      });
      toast.present();
    })
  }

  addImageWatermark(id) {
    watermark([this.blobImage, 'assets/images/watermark.png'])
      .image(watermark.image.lowerRight(0.6))
      .then(img => {
        var blob = this.dataURItoBlob(img.src);
        var file = new File([blob], "fileName.jpeg", {
          type: "image/png"
        });
        this.SaveToStorage(id, file);
      });
  }

  private SaveToStorage(id: any, file: File) {
    const uploadTask = this.storage.upload(
      `files/${id}`,
      file
    );

    uploadTask.percentageChanges().subscribe(change => {
      this.uploadProgress = change;
    });

    uploadTask.then(async (res) => { });
  }

  dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  async selectMedia(event) {
    const toast = await this.toastCtrl.create({
      duration: 4000,
      message: 'Document is being process in the background, please come back soon!!'
    });
    toast.present();
    this.processImage(event);
  }

  processImage(event) {
    const file = event.target.files[0];
    const key = 'm555u31sK7S5dZezYm3xxQx8S5QaeXI_:';
    const BACKEND_URL = 'https://app.nanonets.com/api/v2/OCR/Model/314e1d5f-8f79-47a5-9ad9-f758a599abfd/LabelFile/';
    const selected = file;

    var data = new FormData();
    data.append('file', selected); // file is a Blob object

    this.http.post(`${BACKEND_URL}`, data, {
      headers: {
        Authorization: `Basic ${btoa(`${key}`)}`
      }
    }).subscribe(async (resp: any) => {
      if (resp.message === 'Success') {
        const id = this.firestore.createId();
        if (resp.result.length) {
          const userEmail = localStorage.getItem('userEmail');
          const createAt = new Date();
          const documentId = id;
          const status = '';
          let counter = 0;
          const fileName = resp.result[0].input;
          let gender = '';
          let dOB = '';
          let nationality = '';
          let maritalStatus = '';
          let nameAndSurname = '';
          const predictions = resp.result[0].prediction;
          if (predictions.length) {
            const gen = predictions.find(x => x.label === 'Gender')
            if (gen) {
              gender = gen.ocr_text;
            }

            const dob = predictions.find(x => x.label === 'DOB')
            if (dob) {
              dOB = dob.ocr_text;
            } else {
              counter += 1;
            }

            const nat = predictions.find(x => x.label === 'Nationality')
            if (nat) {
              nationality = nat.ocr_text;
            }

            const mart = predictions.find(x => x.label === 'MaritalStatus')
            if (mart) {
              maritalStatus = mart.ocr_text;
            }

            const name = predictions.find(x => x.label === 'nameAndSurname')
            if (name) {
              nameAndSurname = name.ocr_text;
            } else {
              counter += 1;
            }
            const document = {
              email: userEmail,
              createdAt: createAt,
              documentId: documentId,
              fileName: fileName,
              gender: gender,
              dob: dOB,
              nationality: nationality,
              maritalStatus: maritalStatus,
              nameAndSurname: nameAndSurname,
              status: counter < 2 ? 'Passed' : 'Failed'
            }
            return this.firestore.doc(`userDocuments/${id}`).set({
              ...document
            }).then((res) => {
              this.uploadAFile(file, id, document);
            });
          } else {
            const toast = await this.toastCtrl.create({
              duration: 3000,
              message: 'Incorrect file uploaded'
            });
            toast.present();
          }
        }
      }
    })
  }

  async uploadAFile(file, id, document) {
    this.blobImage = file;
    if (document.status === 'Passed') {
      this.addImageWatermark(id);
    } else {
      this.SaveToStorage(id, file);
    }
  }

  getMimeType(fileExt) {
    if (fileExt == 'wav') return { type: 'audio/wav' };
    else if (fileExt == 'jpg') return { type: 'image/jpg' };
    else if (fileExt == 'mp4') return { type: 'video/mp4' };
    else if (fileExt == 'MOV') return { type: 'video/quicktime' };
  }

  async loadUserDocuments() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    this.files.length = 0
    return this.firestore.collection<any>(`userDocuments`, (ref) =>
      ref.where('email', '==', localStorage.getItem('userEmail')))
      .valueChanges()
      .subscribe((resp) => {
        loading.dismiss();
        if (resp.length) {
          this.files.length = 0
          resp.forEach((file) => {
           const f=  file.fileName.replace(/\.[^/.]+$/, "")
           file.fileName = f;
            this.files.push(file);
          })
        }
      })
  }

  async download(file: any) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    const downloadURL = this.storage.ref(`files/${file.documentId}`).getDownloadURL();

    downloadURL.subscribe(url => {
      if (url) {
        loading.dismiss();
        this.iab.create(url);
      }
    });
  }
}
