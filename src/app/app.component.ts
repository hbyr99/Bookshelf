import { Component } from '@angular/core';
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
  public labels = ['Favorites', 'Wishlist'];
  constructor(public dataService: DataService) {
    this.shelfList = dataService.shelves$;
  }
}
