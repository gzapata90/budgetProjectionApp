import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { ServerService } from '../core/server.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(private authSvc: AuthService, private router: Router,private serverService: ServerService) { }

  ngOnInit() {
  }

  register(email: string, password1: string, password2: string) {

    if (!(password1 === password2)) {
      // Can implement custom handler here
      alert('Passwords don\'t match');
      return;
    }

    console.log(`attempting registration {${email}, ${password1}}`);

    this.authSvc.register(email, password1)
      .then(userId => {
        console.log('registered');
        this.router.navigate([`home/${userId}`]);
      })
      .catch(err => {
        alert(err);
      });
  }

}
