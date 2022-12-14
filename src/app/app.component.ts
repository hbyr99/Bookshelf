import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { EMPTY, Observable, take } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { DataService } from './services/data/data.service';
import { ScanService } from './services/scan/scan.service';
import { Book, Shelf } from './utils/interfaces';
import { PickerController } from '@ionic/angular';
import { AlertOptions } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

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
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController
  ) {
    auth.user.subscribe((user) => {
      this.shelfList = data.shelves$;
    });
  }

  // Open search book modal
  public setSearchBook(state: boolean): void {
    this.isSearchBook = state;
  }

  // Open book information modal
  public openBookInfo(book: Book): void {
    this.isOpenBookInfo = true;
    this.selectedBook = book;
  }

  // Close book information modal
  public closeBookInfo(): void {
    this.isOpenBookInfo = false;
  }

  // Search for book from searchbox
  public async handleSearchBook(event: any): Promise<void> {
    const res = await this.data.findBook(event.target.value);
    console.log(res);
    this.bookList = res;
  }

  // Add book from search book page 
  public async addBookDirectly(book: Book): Promise<void> {
    this.selectedBook = book;
    await this.openPicker();
  }

  // Add a new shelf
  public async addNewShelf(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Please enter new shelf name',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Confirm',
          handler: (shelfName) => {
            this.data
              .addShelf(shelfName.NewShelfName)
              .then((id) => this.router.navigateByUrl('/folder/' + id));
            this.ToastAlert('Shelf Added!');
          },
        },
      ],
      inputs: [
        {
          name: 'NewShelfName',
          type: 'textarea',
          placeholder: 'Shelf name',
          attributes: { maxlength: 50 },
        },
      ],
    });

    await alert.present();
  }

  // Open picker to choose shelf to add book to
  public async openPicker(): Promise<void> {
    this.shelfList.pipe(take(1)).subscribe(async (data) => {
      const options = data.map((shelf) => {
        return { text: shelf.name, value: shelf.id };
      });
      console.log('Open picker log');
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
              this.closeBookInfo();
              this.ToastAlert('Book added!');
            },
          },
        ],
      });
      await picker.present();
    });
  }

  // Open alert to insert shelf name
  public async shelfNameInput(shelfID: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Please enter new shelf name',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Confirm',
          handler: (shelfname) => {
            this.data.changeShelfName(shelfname.NewShelfName, shelfID);
          },
        },
      ],
      inputs: [
        {
          name: 'NewShelfName',
          type: 'textarea',
          placeholder: 'Shelf name',
          attributes: { maxlength: 50 },
        },
      ],
    });

    await alert.present();
  }

  // Open shelf settings
  public async openSettings(shelf: Shelf): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Edit bookshelves',
      buttons: [
        {
          text: 'Change shelf name',
          handler: () => {
            this.shelfNameInput(shelf.id);
          },
        },
        {
          text: 'Delete shelf',
          handler: () => {
            this.data.deleteShelf(shelf.id);
            this.router.navigateByUrl('');
            this.ToastAlert('Shelf Deleted!');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  // Custom toast handler function
  public async ToastAlert(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'bottom',
      cssClass: 'custom-toast',
    });

    await toast.present();
  }

  // Logout user
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

  // Start barcode scanner
  public async startScan(): Promise<void> {
    const isbn = await this.scan.scanBarcode();
    if (isbn) {
      const res = await this.data.findBook(isbn);
      this.openBookInfo(res[0]);
    }
  }

  // Convert HTTP links to HTTPS
  public getHTTPUrl(url: string): string {
    const call = url.slice(4);
    return 'https' + call;
  }
}
