import { Injectable } from '@angular/core';
import { FirebaseApp, firebaseApp$ } from '@angular/fire/app';
import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { Auth, authState, signInAnonymously, signOut, User, GoogleAuthProvider  } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-auth',

})

export class AuthService implements OnInit, OnDestroy {
  private readonly userDisposable: Subscription|undefined;
  public readonly user: Observable<User | null> = EMPTY;

  showLoginButton = false;
  showLogoutButton = false;

  constructor(@Optional() private auth: Auth) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).subscribe(isLoggedIn => {
        this.showLoginButton = !isLoggedIn;
        this.showLogoutButton = !isLoggedIn;
      });
    }
   }

   ngOnInit(): void {}

   ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
   }

   async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
   }

   async logout() {
    return await signOut(this.auth);
   }
}
