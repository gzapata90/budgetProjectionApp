import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login(email: string, password: string) {
    console.log(`attempting login {${email}, ${password}}`);

    this.authSvc.login(email, password)
      .then(userId => {
        console.log('logged in', userId);
        this.router.navigate([`home/${userId}`]);
      })
      .catch(err => {
        console.error('there was an error logging in: ', err);
        alert(err);
      });
  }

}
