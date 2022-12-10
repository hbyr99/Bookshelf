import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { DataService } from './services/data/data.service';
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
    private pickerCtrl: PickerController
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
}
