import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { LostItemService } from '../service/lost-item.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  isFoundUser = false;
  foundDocs = [];
  constructor(
    private router: Router,
    public modalController: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private lostServ: LostItemService) { }

  async ngOnInit(): Promise<void> {
    await this.getMatchedDoc();
  }

  async openChat(doc: any) {
    this.lostServ.saveDocToStore(doc);
    this.router.navigateByUrl('/chat');
  }

  async delete(doc: any) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    this.lostServ.deleteDoc(doc).then((resp) => {
      loading.dismiss();
      this.ngOnInit();
    });
  }

  private async getMatchedDoc() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    const docs = this.lostServ.getmatchedDocs(localStorage.getItem('userEmail'));

    docs.valueChanges().subscribe((resp) => {
      this.foundDocs.length = 0;
      if (resp.length) {
        for (let i = 0; i < resp.length; i++) {
          const element = resp[i];
          this.foundDocs.push(element);
        }
      }
      this.lostServ.getChatlostDocs(localStorage.getItem('userEmail')).subscribe((lostDocs) => {
        var docs = lostDocs;
        for (let i = 0; i < docs.length; i++) {
          const doc = docs[i];
          this.lostServ.getUserChats(doc.id).subscribe((chats) => {
            if (chats.length) {
              const chat: any = chats[i];
              const chatDocs = this.lostServ.getFoundDocuments(chat.chatId);

              chatDocs.valueChanges().subscribe((chatDocuments) => {
                for (let i = 0; i < chatDocuments.length; i++) {
                  const doc = chatDocuments[i];
                  doc.isFoundUser = true;
                  const docToSave = this.foundDocs.find(x => x.lostId === doc.lostId);
                  if (!docToSave)
                    this.foundDocs.push(doc);
                }
              })
            }
          })
        }
      });
    })
  }
}
