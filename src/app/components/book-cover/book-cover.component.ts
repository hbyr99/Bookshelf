import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { ToastController } from '@ionic/angular';
import { Book } from 'src/app/utils/interfaces';

@Component({
  selector: 'app-book-cover',
  templateUrl: './book-cover.component.html',
  styleUrls: ['./book-cover.component.scss'],
})
export class BookCoverComponent implements OnInit {
  @Input() shelfID: string = '';
  @Input() book!: Book;

  public authorString: string = ' ';
  public isOpenBookInfo: boolean = false;
  public favIcon: 'heart-outline' | 'heart-sharp' = 'heart-outline';
  private tempFavorite: boolean = false;

  constructor(
    public dataService: DataService,
    private toastController: ToastController
  ) {
  }

  // Convert HTTP link from Google Books to HTTPS
  public getHTTPUrl(url: string): string {
    const call = url.slice(4);
    return 'https' + call;
  }

  // Populate authorString with the names of the authors
  public displayAuthor(): string {
    this.book.authors.length === 1
      ? (this.authorString = this.book.authors[0])
      : this.book.authors.length === 2
      ? (this.authorString =
          this.book.authors[0] + ' and ' + this.book.authors[1])
      : (this.authorString =
          this.book.authors[0] + ', ' + this.book.authors[1] + ', ' + 'etc.');
    return this.authorString;
  }

  // Open the book information modal
  public openBookInfo(): void {
    this.isOpenBookInfo = true;
    if (!!this.book.favorites) {
      this.favIcon = 'heart-sharp';
      this.tempFavorite = true;
    }
  }

  // Close the book information modal
  public closeBookInfo(): void {
    this.isOpenBookInfo = false;
    this.dataService.updateBookFavorite(this.book.id, this.shelfID, this.tempFavorite);
  }

  // Update favorite icon based on book status
  public changeIcon(): void {
    this.favIcon === 'heart-outline'
      ? (this.favIcon = 'heart-sharp')
      : (this.favIcon = 'heart-outline');
  }

  // Delete book from shelf
  public async deleteBook(): Promise<void> {
    this.dataService.deleteBook(this.book.id, this.shelfID);
    const toast = await this.toastController.create({
      message: 'Book Deleted',
      duration: 1000,
      position: 'bottom',
    });

    await toast.present();
  }

  // Add or remove book from favorites
  public async toFavorites(): Promise<void> {
    this.changeIcon();
    let favoritesMessage: string;
    if (this.book.favorites) {
      this.dataService.deleteBookByName(this.book, 'Favorites');
      this.tempFavorite = false;
      favoritesMessage = 'Book Removed';
    } else {
      this.dataService.addBook(this.book, 'Favorites');
      this.tempFavorite = true;
      favoritesMessage = 'Book Added';
    }

    const toast = await this.toastController.create({
      message: favoritesMessage,
      duration: 1000,
      position: 'bottom',
    });

    await toast.present();
  }

  ngOnInit() {}
}
