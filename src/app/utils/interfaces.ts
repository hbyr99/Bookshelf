export interface Shelf {
  name: string;
}

export interface Book {
  title: string;
  authors: string[];
  categories: string[];
  description: string;
  imageLinks: { smallThumbnail: string; thumbnail: string };
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
