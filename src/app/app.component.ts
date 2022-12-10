import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { DataService } from './services/data/data.service';
import { ScanService } from './services/scan/scan.service';
import { Book, Shelf } from './utils/interfaces';
import { PickerController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public shelfList: Observable<Shelf[]> = EMPTY;
  public labels: string[] = ['Favorites', 'Wishlist'];
  public isSearchBook: boolean = false;
  public isOpenBookInfo: boolean = false;
  public bookList: Book[] = [];
  public selectedBook!: Book;
  public bookAdded: string = ' ';

  constructor(
    public data: DataService,
    public auth: AuthService,
    private pickerCtrl: PickerController,
    public scan: ScanService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    auth.user.subscribe((user) => {
      this.shelfList = data.shelves$;
    });
  }

  public setSearchBook(state: boolean): void {
    this.isSearchBook = state;
  }

  public openBookInfo(book: Book): void {
    this.isOpenBookInfo = true;
    this.selectedBook = book;
  }

  public closeBookInfo(): void {
    this.isOpenBookInfo = false;
  }

  public async handleChange(event: any): Promise<void> {
    const res = await this.data.findBook(event.target.value);
    console.log(res);
    this.bookList = res;
  }

  public async addBookDirectly(book: Book): Promise<void> {
    this.selectedBook = book;
    await this.openPicker();
  }

  public async openPicker(): Promise<void> {
    this.shelfList.subscribe(async (data) => {
      const options = data.map((shelf) => {
        return { text: shelf.name, value: shelf.id };
      });
      console.log(options);
      const picker = await this.pickerCtrl.create({
        columns: [
          {
            name: 'shelf',
            options: options,
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Confirm',
            handler: (selected) => {
              this.data.addBook(this.selectedBook, selected.shelf.value);
            },
          },
        ],
      });
      await picker.present();
    });
  }
  public async onLogout(): Promise<void> {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    try {
      await this.auth.logoutUser();
      loading.dismiss();
      this.router.navigateByUrl('');
    } catch (error) {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: error as string,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          },
        ],
      });
      alert.present();
    }
  }

  public async startScan(): Promise<void> {
    const isbn = '';
    const res = await this.data.findBook(isbn);
    console.log(res);
  }
}
