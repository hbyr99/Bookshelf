import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './services/data.service';
import { Shelf } from './utils/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public shelfList: Observable<Shelf[]>;
  public labels: string[] = ['Favorites', 'Wishlist'];
  public isSearchBook: boolean = false;
  constructor(public dataService: DataService) {
    this.shelfList = dataService.shelves$;
  }

  public setSearchBook(state: boolean): void {
    this.isSearchBook = state;
  }
}
