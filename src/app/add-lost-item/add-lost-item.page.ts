import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { LostItemService } from '../service/lost-item.service';

@Component({
  selector: 'app-add-lost-item',
  templateUrl: './add-lost-item.page.html',
  styleUrls: ['./add-lost-item.page.scss'],
})
export class AddLostItemPage implements OnInit {
  lostDocForm: FormGroup;
  selectedDocumentType: any;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    public loadingController: LoadingController,
    private lostDocService: LostItemService,
    private toastController: ToastController,
    private router: Router) { }


  ngOnInit() {
    this.lostDocForm = this.fb.group({
      documentType: [''],
      dateFound: [''],
      createdAt: [''],
      idNumber: [''],
      firstname: [''],
      lastname: [''],
      address: [''],
      referenceNumber: [''],
      description: [''],
      isDeleted: [Boolean],
      isFound: [Boolean],
      email: ['']
    });
  }

  async saveFoundDoc() {
    this.lostDocForm.controls['documentType'].setValue(this.selectedDocumentType);
    this.lostDocForm.controls['createdAt'].setValue(new Date());
    this.lostDocForm.controls['isDeleted'].setValue(false);
    this.lostDocForm.controls['isFound'].setValue(false);
    this.lostDocForm.controls['email'].setValue(localStorage.getItem('userEmail'));
    this.lostDocService.saveFoundDoc(this.lostDocForm.value);
  }

  onDocumentChaged(event): void {
    this.selectedDocumentType = event.detail.value;
  }
}
