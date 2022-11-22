export interface Shelf {
  name: string;
}

export interface Book {
  title: string;
  author: string;
  genre: string;
  favorite: boolean;
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}