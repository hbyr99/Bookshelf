import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-book-cover',
  templateUrl: './book-cover.component.html',
  styleUrls: ['./book-cover.component.scss'],
})
export class BookCoverComponent implements OnInit {
  @Input() authors: string = ' ';
  @Input() title: string = ' ';
  @Input() categories: string = ' ';
  @Input() description: string = ' ';

  public authorList: string[] = [];
  public categoryList: string[] = [];

  public isOpenBookInfo: boolean = false;

  constructor() {}

  public openBookInfo() {
    this.isOpenBookInfo = true;

    this.authorList = this.authors.split(',');
    this.categoryList = this.categories.split(',');

    console.log(this.authorList);
  }

  public closeBookInfo() {
    this.isOpenBookInfo = false;
  }

  ngOnInit() {}
}
