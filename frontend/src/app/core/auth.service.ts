import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '@firebase/auth-types';

@Injectable()
export class AuthService {

  userId: string;
  email: string;

  constructor(private afAuth: AngularFireAuth) { }

  requestToken(user: User) {
    user.getIdToken().then(function(token) {
      console.log("Retrieved token for newly logged in user!");
      localStorage['token'] = token;
    })
  }

  handleUserSuccess(user: User) {
      this.userId = user.uid;
      this.email = user.email;
      this.requestToken(user);
      return this.userId;
  }

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(this.handleUserSuccess);
  }

  register(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(this.handleUserSuccess);
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

}
