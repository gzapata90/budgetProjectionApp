import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { ServerService } from '../core/server.service';


@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  constructor(private authSvc: AuthService, private router: Router, private serverService: ServerService) { }

  ngOnInit() {
    this.authSvc.verifyUser((uid) => {
      this.serverService.get(`/${uid}/budgets`)
        .subscribe(
          (response) => {
            console.log('success', response)
          },
          (error) => {
            this.serverService.post(`/${uid}`,{'userid':uid})
            .subscribe(
              (response) =>{
                console.log('new account created')
              },
              (error) =>{
                console.log('cannot create account')
              }
            )
          }
        )
    }, () => {
      this.router.navigate(['/login']);
    })
  }

}
