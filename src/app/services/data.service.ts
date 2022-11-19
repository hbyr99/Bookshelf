import { Injectable } from '@angular/core';
import {
  doc,
  addDoc,
  collection,
  collectionData,
  Firestore,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Book, Shelf } from '../utils/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private userID = 'oms1mKDUn7hzty6Ks8Kw';
  public shelves$: Observable<Shelf[]>;
  constructor(private firestore: Firestore) {
    const shelves = collection(firestore, 'users', this.userID, 'shelves');
    this.shelves$ = collectionData(shelves) as Observable<Shelf[]>;
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
      )
    ) as Observable<Book[]>;
  }

  public addShelf(shelfName: string): void {
    setDoc(
      doc(
        collection(this.firestore, 'users', this.userID, 'shelves'),
        shelfName
      ),
      {
        name: shelfName,
      }
    );
  }
}
