import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName: string;
  budget: {budgetId: string, createDate: string, description: string, goal: number, name: string, uidOfOwner: string};
  account: {balance: number, accountId: string, description: string};
  transactions: [{amount: number, date: string, accountID: string, description: string, type: string}];
  private sub: any;
  chartOptions = {responsive: true};
  chartData = [];
  chartLabels = [];
  onChartClick(event) {
    console.log(event);
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userName = params['user']; // (+) converts string 'id' to a number
      
      // In a real app: dispatch action to load the details here.
      //temp variables
      this.budget = {budgetId: "", createDate: "", description: "", goal: 0, name: "", uidOfOwner: ""};
      this.budget.budgetId = "budgetid";
      this.budget.createDate = "02/28/2018";
      this.budget.description = "budget description";
      this.budget.goal = 1000;
      this.budget.name = "My Budget";
      this.budget.uidOfOwner = "abcid";
      this.account = {balance: 0, accountId: "", description: ""};
      this.account.balance = 500;
      this.account.accountId = "accountId";
      this.account.description = "account description";
      this.transactions = [{amount: this.account.balance, date: this.budget.createDate, accountID: this.account.accountId, description: "Starting Balance", type: "deposit"}];
      this.transactions.push({amount: 100, date: "5/6/2018", accountID: "accountId", description: "I bought tacos", type: "withdraw"});
      this.transactions.push({amount: 200, date: "5/7/2018", accountID: "accountId", description: "Little Caesars All Day", type: "withdraw"});
      this.transactions.push({amount: 1000, date: "5/8/2018", accountID: "accountId", description: "Paycheck", type: "deposit"});
      this.transactions.push({amount: 500, date: "5/8/2018", accountID: "accountId", description: "Paycheck", type: "withdraw"});
      this.transactions.push({amount: 500, date: "5/10/2018", accountID: "accountId", description: "Rent", type: "withdraw"});
      this.transactions.push({amount: 300, date: "5/10/2018", accountID: "accountId", description: "Gift", type: "deposit"});
      this.transactions.push({amount: 600, date: "5/12/2018", accountID: "accountId", description: "Bonus", type: "deposit"});
      //end tempvariables

      let tempBalance = 0;
      let accountIndex = -1;
      let balanceIndex = 0;
      for (let transaction of this.transactions) {
            if (this.chartLabels.indexOf(transaction.date) == -1) {
              this.chartLabels.push(transaction.date);
              accountIndex = -1;
              for (let account of this.chartData) {
                if(account.label == transaction.accountID) {
                  accountIndex = this.chartData.indexOf(account);
                  break;
                }
              }
              if (accountIndex == -1) {
                this.chartData.push({data: [], label: transaction.accountID})
                accountIndex = this.chartData.length - 1;
              }
              if (transaction.type == "withdraw") {
                tempBalance -= transaction.amount;
              }
              else if (transaction.type == "deposit") {
                tempBalance += transaction.amount;
              }
              this.chartData[accountIndex].data.push(tempBalance);
              balanceIndex++;
            }
            else {
              accountIndex = -1;
              for (let account of this.chartData) {
                if(account.label == transaction.accountID) {
                  accountIndex = this.chartData.indexOf(account);
                  break;
                }
              }
              if (accountIndex == -1) {
                this.chartData.push({data: [], label: transaction.accountID})
                accountIndex = this.chartData.length - 1;
              }
              if (transaction.type == "withdraw") {
                tempBalance -= transaction.amount;
              }
              else if (transaction.type == "deposit") {
                tempBalance += transaction.amount;
              }
              this.chartData[accountIndex].data[balanceIndex - 1] = tempBalance;
            }
      }
      this.account.balance = tempBalance;
   });
  }
}
