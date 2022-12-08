import { Component, ViewChild } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { DataService } from './services/data.service';
import { Book, Shelf } from './utils/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public shelfList: Observable<Shelf[]>;
  public labels: string[] = ['Favorites', 'Wishlist'];
  public isSearchBook: boolean = false;
  public bookList: Book[] = [];

  constructor(public dataService: DataService) {
    this.shelfList = dataService.shelves$;
  }

  public setSearchBook(state: boolean): void {
    this.isSearchBook = state;
  }

  public async handleChange(event: any): Promise<void> {
    const res = await this.dataService.findBook(event.target.value);
    console.log(res);
    this.bookList = res;
  }
}
