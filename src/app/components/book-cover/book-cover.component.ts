import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-book-cover',
  templateUrl: './book-cover.component.html',
  styleUrls: ['./book-cover.component.scss'],
})
export class BookCoverComponent implements OnInit {

  @Input() author: string;
  @Input() title: string;
  @Input() genre: string;

  bookInfo: any;

  constructor() {
    this.author = " ";
    this.title = " ";
    this.genre = " ";
  }

  ngOnInit() {
    this.bookInfo = document.querySelector('.book-info');
  }
}
