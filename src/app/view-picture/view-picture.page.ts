import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-view-picture',
  templateUrl: './view-picture.page.html',
  styleUrls: ['./view-picture.page.scss'],
})
export class ViewPicturePage implements OnInit {
  id: any;
  imageUrl = '';

  constructor(private route: ActivatedRoute,
    private storage: AngularFireStorage,
    public loadingController: LoadingController,) { }

  ngOnInit() {
    this.loadDocumentPicture();
  }

  async loadDocumentPicture() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    const id = localStorage.getItem('id');
    const downloadURL = this.storage.ref(`/documentFiles/${id}`).getDownloadURL();

    downloadURL.subscribe(url => {
      if (url) {
        loading.dismiss();
        this.imageUrl = url;
      }
    });
  }
}
