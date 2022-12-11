import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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
  @Input() imageLinks: string = ' ';

  public authorList: string[] = [];
  public categoryList: string[] = [];
  public authorString: string = ' ';
  public isOpenBookInfo: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  public getSanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public displayAuthor(): string {
    const authorList = this.authors.split(',');
    authorList.length === 1
      ? (this.authorString = authorList[0])
      : authorList.length == 2
      ? (this.authorString = authorList[0] + ' and ' + authorList[1])
      : (this.authorString =
          authorList[0] + ', ' + authorList[1] + ', ' + 'etc.');
    return this.authorString;
  }

  public openBookInfo() {
    this.isOpenBookInfo = true;
    this.authorList = this.authors.split(',');
    this.categoryList = this.categories.split(',');
  }

  public closeBookInfo() {
    this.isOpenBookInfo = false;
  }

  ngOnInit() {}
}
