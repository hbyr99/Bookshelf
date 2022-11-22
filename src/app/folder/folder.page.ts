import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import { PhotoService } from '../services/photo.service';
import { Book } from '../utils/interfaces';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  public folder: string = '';
  public bookName: string = '';
  public book$: Observable<Book[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public photoService: PhotoService
  ) {
    this.folder = activatedRoute.snapshot.paramMap.get('id')!;
    this.book$ = dataService.getBooks$(this.folder);
  }

  ngOnInit() {}

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.bookName, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      true
    }
  }

  takePhoto() : void {
    this.photoService.takePhoto();
  }
}
