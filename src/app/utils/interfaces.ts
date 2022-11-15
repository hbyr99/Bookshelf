export interface Shelf {
  title: string;
  url: string;
  books?: Book[];
}

export interface Book {
  title: string;
  author: string;
  genre: string;
  favorite: boolean;
}
