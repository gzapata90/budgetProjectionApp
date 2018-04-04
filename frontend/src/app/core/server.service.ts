import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ServerService {

  hostName = 'https://budget-projection-app.herokuapp.com'
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZlYThhZmIwMjFjMjEzMDhjNzkzMDI2ZTMzNDA4ZGI3MDc2ODc0MWEifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYnVkZ2V0cHJvamVjdGlvbmFwcCIsImF1ZCI6ImJ1ZGdldHByb2plY3Rpb25hcHAiLCJhdXRoX3RpbWUiOjE1MjI4ODM3MTYsInVzZXJfaWQiOiJ6RDJNNjJiWGF3UTN2V1hzSng1TzZOTjdFNkczIiwic3ViIjoiekQyTTYyYlhhd1EzdldYc0p4NU82Tk43RTZHMyIsImlhdCI6MTUyMjg4MzcxNiwiZXhwIjoxNTIyODg3MzE2LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.dZizyDNyMfUH-xCCidvV3f6DM38Uus6dvrfwCgagB6fxfT4Kyllhytu9drju1y-nRIPDwPoFaHkHHgPFndPU0bgIzoowIwPmtHVeZgznetcWAY9luOyRRahIb583HEyd7RNFwpb_vo6em5YXO01C27niezFPdn1pMPZSw5bFY0uT5JXfvJCLK8J9INe7gTYcoUIXHuz_N1ICoL7Ug3xOGcgeDZ15kNxD9PRRdV2kd6gPNVEk8REOQl3PHz-mk_TMn3TeTlaTm92Sn3la0ASMAl7Wv11qhnQcGoOLFg2OFJCf7ojuldyd7BJCuQTyKnQzA_ruk5SZ9gvSHO0n97GItA'
    })
  };
  
  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {
    afAuth.auth.currentUser.getIdToken(true).then(token => {
      httpOptions.headers = httpOptions.headers.set('Authorization', token);
    }
  }

  // url should include the endpoint and any ids required to know what you are getting
  get(url): Observable<any> {
    console.log("inside of service get function");
    console.log(httpOptions.get('Authorization'));
    return this.http.get(this.hostName + url, httpOptions);
  }

  // url same as get, body is the json object you want to save
  post(url, body): Observable<any> {
    return this.http.post(this.hostName + url, body, httpOptions);
  }

  // same as post
  put(url, body): Observable<any> {
    return this.http.put(this.hostName + url, body, httpOptions);
  }

  // same as get
  delete(url): Observable<any> {
    return this.http.delete(this.hostName + url, httpOptions);
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
