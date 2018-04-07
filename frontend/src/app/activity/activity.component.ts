import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ServerService } from '../core/server.service';

@Component({
  selector: 'app-home',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  userName: string;
  budget: {ownerUID: string, creationDate: Date, description: string, goal: number, name: string};
  account: {balance: number, accountId: string, description: string};
  transactions: [{amount: number, endDate: Date, startDate: Date, accountID: string, description: string, interval: number}];
  transactionLog: [{amount: number, date: string, accountID: string, description: string, interval: number}];
  private sub: any;

  constructor(private authSvc: AuthService, private route: ActivatedRoute, private router: Router, private serverService: ServerService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userName = params['user']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      //temp variables
      this.budget = {ownerUID: "", creationDate: new Date(), description: "", goal: 0, name: ""};
      this.account = {balance: 0, accountId: "", description: ""};
      this.transactionLog = [{amount: 0, date: "", accountID: "", description: "", interval: 0}];







     
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

      

      this.authSvc.verifyUser((uid) => {
          //Gets budget object
          this.serverService.get('/' + uid + '/budgets').subscribe(
              res => {
                console.log("Result: ", res);
                this.budget = res[0];
                this.budget.creationDate = new Date(this.budget.creationDate);
                let startingTransaction;

                //Gets account object
                this.serverService.get('/sZjRUvJOVmd0mq33Q9pW/account/2FPfC9ALIzc8MiYeZ1v1').subscribe(
                    res => {
                      console.log("Result: ", res);
                      this.account = res;
                      startingTransaction = {amount: this.account.balance, endDate: this.budget.creationDate, startDate: this.budget.creationDate.toLocaleDateString(), accountID: '2FPfC9ALIzc8MiYeZ1v1', description: "Starting Balance", interval: 0};

                      //Gets transaction objects
                        this.serverService.get('/sZjRUvJOVmd0mq33Q9pW/transactions').subscribe(
                          res => {
                            console.log("Result: ", res);
                            this.transactions = res;
                            this.transactions.push(startingTransaction);
                            //calculates current balance and adds recursive transactions
                            let today = new Date();
                            let tempBalance = 0;
                            this.transactionLog.length = 0;
                            for (let transaction of this.transactions) {
                     
                              this.transactionLog.push({amount: transaction.amount, date: new Date(transaction.startDate).toLocaleDateString(), accountID: transaction.accountID, description: transaction.description, interval: transaction.interval}); 
                      
                              tempBalance += transaction.amount;
                              if (transaction.interval > 0) {
                                let startDate = new Date(transaction.startDate);
                                let endDate = new Date(transaction.endDate);
                                if (datediff(today, endDate) > 0) {
                                  endDate = today;
                                }
                                let occurances = ( Math.floor(datediff(startDate, today) / transaction.interval ) );
                                console.log(transaction)
                                console.log(datediff(startDate, today));
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
                          },
                          error => console.warn("Error", error)
                      );
                    },
                    error => console.warn("Error", error)
                );
              },
              error => console.warn("Error", error)
          )
      });
    });
  }
}

/*let data = {amount: -100, endDate: new Date(), startDate: new Date("2017-11-06T00:00:00"), accountID: "2FPfC9ALIzc8MiYeZ1v1", description: "I bought tacos", interval: 0};
    
          this.serverService.post('/sZjRUvJOVmd0mq33Q9pW/transaction', data).subscribe(
              res => {
                console.log("Result: ", res);
              },
              error => console.warn("Error", error)
          );*/