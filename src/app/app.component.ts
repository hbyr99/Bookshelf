import { Component } from '@angular/core';
import { Shelf } from './utils/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public shelfList: Shelf[] = [
    { title: 'Shelf 1', url: '/folder/Shelf 1' },
    { title: 'Shelf 2', url: '/folder/Shelf 2' },
    { title: 'Shelf 3', url: '/folder/Shelf 3' },
    { title: 'Shelf 4', url: '/folder/Shelf 4' },
  ];
  public labels = ['Favorites', 'Wishlist'];
  constructor() {}

  addShelf(title : string) {
    const url = `folder/${title}`;
    const newShelf : Shelf = {title, url};
    this.shelfList.push(newShelf);
  }
}
