import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { User } from '@firebase/auth-types';

@Injectable()
export class AuthService {

  userId: string;
  email: string;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

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
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(user => this.handleUserSuccess(user));
  }

  register(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(user => this.handleUserSuccess(user));
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  getUser() {
    return this.afAuth.auth.currentUser.uid;
  }

  verifyUser(userCall,noUserCall) {
    this.afAuth.auth.onAuthStateChanged(user=>{
      if (user){
        userCall(user.uid)
      }else{
        noUserCall()
      }
    })
  }

}
