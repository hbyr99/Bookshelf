import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ScanService } from 'src/app/services/scan/scan.service';
import { DataService } from '../../services/data/data.service';
import { Book } from '../../utils/interfaces';

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
    public scan: ScanService
  ) {
    this.folder = activatedRoute.snapshot.paramMap.get('id')!;
    this.book$ = dataService.getBooks$(this.folder);
  }

  ngOnInit() {}
}
