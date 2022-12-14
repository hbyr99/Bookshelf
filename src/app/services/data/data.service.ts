import { Injectable } from '@angular/core';
import {
  doc,
  collection,
  collectionData,
  Firestore,
  setDoc,
  query,
  addDoc,
  getDoc,
  updateDoc,
  docData,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { deleteDoc } from 'firebase/firestore';
import { EMPTY, from, Observable } from 'rxjs';

import { Book, Shelf } from '../../utils/interfaces';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private userID: string = '';
  public shelves$: Observable<Shelf[]> = EMPTY;

  // Get current user from Auth
  constructor(private firestore: Firestore, private auth: AuthService) {
    auth.user.subscribe((user) => {
      if (user) {
        this.userID = user.uid;
        const shelves = collection(firestore, 'users', this.userID, 'shelves');
        this.shelves$ = collectionData(shelves, {
          idField: 'id',
        }) as Observable<Shelf[]>;
      }
    });
  }

  // Get books Observable from Firebase
  public getBooks$(shelfId: string): Observable<Book[]> {
    return collectionData(
      collection(
        this.firestore,
        'users',
        this.userID,
        'shelves',
        shelfId,
        'books'
      ),
      { idField: 'id' }
    ) as Observable<Book[]>;
  }

  // Get shelf Observable from Firebase
  public getShelf$(shelfId: string): Observable<Shelf> {
    return docData(
      doc(this.firestore, 'users', this.userID, 'shelves', shelfId)
    ) as Observable<Shelf>;
  }

  // Add shelf to Firebase
  public async addShelf(shelfName: string): Promise<string> {
    if (shelfName === 'Favorites' || shelfName === 'Wishlist') {
      setDoc(doc(this.firestore, 'users', this.userID, 'shelves', shelfName), {
        name: shelfName,
      });
      return shelfName;
    } else {
      const docRef = await addDoc(
        collection(this.firestore, 'users', this.userID, 'shelves'),
        {
          name: shelfName,
        }
      );
      return docRef.id;
    }
  }

  // Add book to shelf
  public addBook(book: Book, shelfID: string): void {
    addDoc(
      collection(
        this.firestore,
        'users',
        this.userID,
        'shelves',
        shelfID,
        'books'
      ),
      {
        title: book.title,
        authors: book.authors,
        categories: book.categories,
        description: book.description,
        imageLinks: book.imageLinks,
      }
    );
  }

  // Update whether book is favorited 
  public updateBookFavorite(
    bookID: string,
    shelfID: string,
    favorites: boolean
  ): void {
    updateDoc(
      doc(
        this.firestore,
        'users',
        this.userID,
        'shelves',
        shelfID,
        'books',
        bookID
      ),
      { favorites: favorites }
    );
  }

  // Delete book from shelf
  public deleteBook(bookID: string, shelfID: string): void {
    deleteDoc(
      doc(
        this.firestore,
        'users',
        this.userID,
        'shelves',
        shelfID,
        'books',
        bookID
      )
    );
  }

  // Delete book according to its name. Mainly used for removing book from favorite shelf
  public async deleteBookByName(book: Book, shelfID: string): Promise<void> {
    const booksWithName = await getDocs(
      query(
        collection(
          this.firestore,
          'users',
          this.userID,
          'shelves',
          shelfID,
          'books'
        ),
        where('title', '==', book.title),
        where('authors', '==', book.authors)
      )
    );
    booksWithName.forEach((doc) => {
      this.deleteBook(doc.id, shelfID);
    });
  }

  // Update shelf name
  public changeShelfName(shelfname: string, shelfID: string): void {
    updateDoc(doc(this.firestore, 'users', this.userID, 'shelves', shelfID), {
      name: shelfname,
    });
  }

  // Delete shelf from Firebase
  public deleteShelf(shelfID: string): void {
    deleteDoc(doc(this.firestore, 'users', this.userID, 'shelves', shelfID));
  }

  // Find book from Google Books API
  public async findBook(bookName: string): Promise<Book[]> {
    let booksFound: any[] = [];
    const APIKey = 'AIzaSyChtrHz2afCweT8Uk1BKKG7-rnbsNTyzy4';

    const options = {
      url: 'https://www.googleapis.com/books/v1/volumes',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        q: bookName,
        key: APIKey,
      },
    };
    //await from(CapacitorHttp.get(options)).forEach(res => booksFound.push(res.data.items));

    const res = await CapacitorHttp.get(options);
    return res.data.items.map((entry: any) => entry.volumeInfo as Book);
  }
}
