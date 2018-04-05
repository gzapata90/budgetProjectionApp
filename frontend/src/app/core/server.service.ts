import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ServerService {

  hostName = 'https://budget-projection-app.herokuapp.com';
    httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'invalid_token'
    })
  };
  
  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {
    this.afAuth.idToken.subscribe(token => {
      console.log("Updating token!", token);
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
    })
    if(localStorage['token'] && this.httpOptions.headers.get('Authorization') === 'invalid_token')  {
      console.log("Setting initial token to localStorage one!");
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', localStorage['token']);
    }
    else {
      console.warn("No current user or some other auth error?");
    }
  }

  checkTokenSet(): Boolean {
    return this.httpOptions.headers.get('Authorization') !== 'invalid_token';
  }

  // url should include the endpoint and any ids required to know what you are getting
  get(url): Observable<any> {
    if(!this.checkTokenSet()) {
      return Observable.fromPromise(Promise.reject("No Token Set!"));
    }
    return this.http.get(this.hostName + url, this.httpOptions);
  }

  // url same as get, body is the json object you want to save
  post(url, body): Observable<any> {
    if(!this.checkTokenSet()) {
      return Observable.throw(new Error("No Token Set!"));
    }
    return this.http.post(this.hostName + url, body, this.httpOptions);
  }

  // same as post
  put(url, body): Observable<any> {
    if(!this.checkTokenSet()) {
      return Observable.throw(new Error("No Token Set!"));
    }
    return this.http.put(this.hostName + url, body, this.httpOptions);
  }

  // same as get
  delete(url): Observable<any> {
    if(!this.checkTokenSet()) {
      return Observable.throw(new Error("No Token Set!"));
    }
    return this.http.delete(this.hostName + url, this.httpOptions);
  }


  /*
    import { ServerService } from '../core/server.service';

    constructor(private serverService: ServerService) {}

    this.serverService.get("blah/blah/:blah")
    .subscribe(
      (response) => {
        doSomething(response.data)
      },
      (error) => {
        somethingWentWrong()
      }
    )

    or

    this.serverService.post("blah/blah/:blah", body)
    .subscribe(
      (response) => {
        doSomething(response.data)
      },
      (error) => {
        somethingWentWrong()
      }
    )
  */

}
