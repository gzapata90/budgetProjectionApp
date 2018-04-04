import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ServerService {

  hostName = 'https://budget-projection-app.herokuapp.com'

  constructor(private http: HttpClient) { }

  // url should include the endpoint and any ids required to know what you are getting
  get(url): Observable<any> {
    console.log("inside of service get function");
    return this.http.get(this.hostName + url);
  }

  // url same as get, body is the json object you want to save
  post(url, body): Observable<any> {
    return this.http.post(this.hostName + url, body);
  }

  // same as post
  put(url, body): Observable<any> {
    return this.http.put(this.hostName + url, body);
  }

  // same as get
  delete(url): Observable<any> {
    return this.http.delete(this.hostName + url);
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
