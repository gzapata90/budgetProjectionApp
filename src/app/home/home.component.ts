import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName: string;
  budget: [];
  account: [];
  transaction: [];
  private sub: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userName = params['user']; // (+) converts string 'id' to a number
      
      // In a real app: dispatch action to load the details here.
      this.budget = [];
      this.budget.budgetId = "budgetid";
      this.budget.createDate = "02/28/2018";
      this.budget.description = "budget description";
      this.budget.goal = 1000;
      this.budget.name = "My Budget";
      this.budget.uidOfOwner = "abcid";
      this.account = [];
      this.account.balance = 500;
      this.account.accountId = "accountId";
      this.account.description = "account description";
      // In a real app: dispatch action to load the details here.
   });
  }

}
