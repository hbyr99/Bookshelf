import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;

  showLoginFeatures = false;

  // Get Observable user from Firebase
  constructor(private auth: Auth) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).subscribe((isLoggedIn) => {
        this.showLoginFeatures = !!isLoggedIn;
      });
    }
  }

  // Login user to Firebase
  async loginUser(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // Signup user to Firebase
  async signupUser(email: string, password: string): Promise<any> {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Reset user password
  async resetPassword(email: string): Promise<void> {
    return await sendPasswordResetEmail(this.auth, email);
  }

  // Logout user from Firebase
  async logoutUser(): Promise<void> {
    return await signOut(this.auth);
  }
}
