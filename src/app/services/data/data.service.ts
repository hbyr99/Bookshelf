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

  public getShelf$(shelfId: string): Observable<Shelf> {
    return docData(
      doc(this.firestore, 'users', this.userID, 'shelves', shelfId)
    ) as Observable<Shelf>;
  }

  public async addShelf(shelfName: string): Promise<string> {
    if (shelfName === 'Favorites' || shelfName === 'Wishlist') {
      setDoc(
        doc(this.firestore, 'users', this.userID, 'shelves', shelfName),
        { name: shelfName, }
      );
      return shelfName;
    } else {
      const docRef =  await addDoc(collection(this.firestore, 'users', this.userID, 'shelves'), {
        name: shelfName,
      });
      return docRef.id;
    }
  }

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

  public changeShelfName(shelfname: string, shelfID: string): void {
    updateDoc(doc(this.firestore, 'users', this.userID, 'shelves', shelfID), {
      name: shelfname,
    });
  }

  public deleteShelf(shelfID: string): void {
    deleteDoc(doc(this.firestore, 'users', this.userID, 'shelves', shelfID));
  }

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
