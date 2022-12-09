import { Injectable } from '@angular/core';
import {
  doc,
  collection,
  collectionData,
  Firestore,
  setDoc,
  query,
  addDoc,
} from '@angular/fire/firestore';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
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
        this.shelves$ = collectionData(shelves, { idField: 'id' }) as Observable<
          Shelf[]
        >;
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

  public addShelf(shelfName: string): void {
    addDoc(
        collection(this.firestore, 'users', this.userID, 'shelves'),
      {
        name: shelfName,
      }
    );
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
