import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { async } from '@firebase/util';
import { IonModal } from '@ionic/angular';
import { throws } from 'assert';
import { Observable } from 'rxjs';
import { ScanService } from 'src/app/services/scan/scan.service';
import { DataService } from '../../services/data/data.service';
import { Book, Shelf } from '../../utils/interfaces';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  public folder: string = '';
  public myShelf$: Observable<Shelf>;
  public bookName: string = '';
  public book$: Observable<Book[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public scan: ScanService
  ) {
    this.folder = activatedRoute.snapshot.paramMap.get('id')!;
    if (this.folder  === 'Wishlist' || this.folder === 'Favorites') {
      dataService.addShelf(this.folder);
    }
    this.myShelf$ = dataService.getShelf$(this.folder);
    this.book$ = dataService.getBooks$(this.folder);
  }

  ngOnInit() {}
}
