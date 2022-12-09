import { Component, ViewChild } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { DataService } from './services/data/data.service';
import { Book, Shelf } from './utils/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public shelfList: Observable<Shelf[]> = EMPTY;
  public labels: string[] = ['Favorites', 'Wishlist'];
  public isSearchBook: boolean = false;
  public bookList: Book[] = [];

  constructor(public data: DataService, public auth: AuthService) {
    auth.user.subscribe((user) => {
      this.shelfList = data.shelves$;
    });
  }

  public setSearchBook(state: boolean): void {
    this.isSearchBook = state;
  }

  public async handleChange(event: any): Promise<void> {
    const res = await this.data.findBook(event.target.value);
    console.log(res);
    this.bookList = res;
  }
}
