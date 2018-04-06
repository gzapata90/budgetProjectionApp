import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  userName: string;
  budget: {budgetId: string, createDate: Date, description: string, goal: number, name: string, uidOfOwner: string};
  account: {balance: number, accountId: string, description: string};
  transactions: [{amount: number, date: Date, accountID: string, description: string, interval: number}];
  transactionLog: [{amount: number, date: string, accountID: string, description: string, interval: number}];
  private sub: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userName = params['user']; // (+) converts string 'id' to a number
      
      // In a real app: dispatch action to load the details here.
      //temp variables
      this.budget = {budgetId: "", createDate: new Date(), description: "", goal: 0, name: "", uidOfOwner: ""};
      this.budget.budgetId = "budgetid";
      this.budget.createDate = new Date("2017-08-28T00:00:00");
      this.budget.description = "budget description";
      this.budget.goal = 1000;
      this.budget.name = "My Budget";
      this.budget.uidOfOwner = "abcid";
      this.account = {balance: 0, accountId: "", description: ""};
      this.account.balance = 500;
      this.account.accountId = "accountId";
      this.account.description = "account description";
      this.transactions = [{amount: this.account.balance, date: this.budget.createDate, accountID: this.account.accountId, description: "Starting Balance", interval: 0}];
      this.transactions.push({amount: -100, date: new Date("2017-11-06T00:00:00"), accountID: "accountId", description: "I bought tacos", interval: 0});
      this.transactions.push({amount: -200, date: new Date("2017-12-07T00:00:00"), accountID: "accountId", description: "Little Caesars All Day", interval: 0});
      this.transactions.push({amount: 1000, date: new Date("2017-12-08T00:00:00"), accountID: "accountId", description: "Paycheck", interval: 28});
      this.transactions.push({amount: 500, date: new Date("2017-12-08T00:00:00"), accountID: "accountId", description: "Overtime", interval: 60});
      this.transactions.push({amount: -500, date: new Date("2017-12-10T00:00:00"), accountID: "accountId", description: "Rent", interval: 30});
      this.transactions.push({amount: -300, date: new Date("2018-01-10T00:00:00"), accountID: "accountId", description: "Gift", interval: 0});
      this.transactions.push({amount: 600, date: new Date("2018-02-12T00:00:00"), accountID: "accountId", description: "Bonus", interval: 0});
      this.transactions.push({amount: 600, date: new Date("2018-03-12T00:00:00"), accountID: "accountId", description: "Sell Tacos", interval: 10});
      //end tempvariables

      //helper function: converts string date to date object
      function parseDate(str) {
	   	var mdy = str.split('/');
	   	return new Date(mdy[2], mdy[0]-1, mdy[1]);
	  }

	  //helper function: returns number of days between two dates
	  function datediff(first, second) {  
	    return Math.round((second-first)/(1000*60*60*24));
      }

      //calculates current balance and adds recursive transactions
      let today = new Date();
      console.log(today)
      let tempBalance = 0;
      for (let transaction of this.transactions) {
      	  if (this.transactionLog == undefined) {
      	  	this.transactionLog = [{amount: transaction.amount, date: transaction.date.toLocaleDateString(), accountID: transaction.accountID, description: transaction.description, interval: transaction.interval}];
      	  }
      	  else {
			this.transactionLog.push({amount: transaction.amount, date: transaction.date.toLocaleDateString(), accountID: transaction.accountID, description: transaction.description, interval: transaction.interval}); 
      	  }
          tempBalance += transaction.amount;
      	  if (transaction.interval > 0) { 
      	  	let startDate = transaction.date;
			let occurances = ( Math.floor(datediff(startDate, today) / transaction.interval ) );
			let tempDate;
			for (let i = 0; i < occurances; i++) {
				startDate.setDate(startDate.getDate() + transaction.interval);
				tempDate = (startDate.getMonth() + 1) + '/' + (startDate.getDate()) + '/' + (startDate.getFullYear());
				this.transactionLog.push({amount: transaction.amount, date: tempDate, accountID: transaction.accountID, description: transaction.description, interval: transaction.interval});
				tempBalance += transaction.amount;
			}
      	  }
      }

      //sorts transaction list by date
      this.transactionLog.sort((a,b) => {
      	let aDate = parseDate(a.date);
      	let bDate = parseDate(b.date);
      	if (aDate > bDate) {
      		return 1;
      	}
      	if (aDate < bDate) {
      		return -1;
      	}
      	return 0;
      });

      //sets current balace according to transactions
      this.account.balance = tempBalance;
   });
  }
}
