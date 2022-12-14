/* Interface definition file */
export interface Shelf {
  id: string;
  name: string;
}

export interface Book {
  title: string;
  authors: string[];
  categories: string[];
  description: string;
  imageLinks: { smallThumbnail: string; thumbnail: string };
  id: string;
  favorites?: boolean;
}

