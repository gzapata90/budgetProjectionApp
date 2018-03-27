//These functions are built on the premise of only having one account
//If we are going to add functionality for two or more accounts this 
//function will need to change to an array of transactionArrays so
//that each transaction array can be applied to the account that
//it applies to.

//This function is a helper function for the goal estimation function that takes the budgetID and return the array of transactions
function retrieveAllTransactions (transactionRef) {
	//var transactionsRef = req.db.collections('budgets').doc(budgetID).collection('transactions');
	var transactionArray[];

	transactionsRef.get().then(function (querySnapshot) {
		querySnapshot.forEach(function (doc) {
			transactionArray.push(doc.data);
		});
		return transactionArray;
	})
	.catch(function (error) {
		console.log("Error getting transactions: ", error);
		return transactionArray;
	});
};

//Currently will work on the assumption that there is one account, if we 
//go to multiple accounts this will be refactored

//This is a helper function to retrieve the balance for the account that is 
//connected to this budget.
function retrieveAllBalances (accountRef) {
	accountRef.get().then(function(querySnapshot) {
		quesrySnapshot.forEach(function(doc) { //for our MVP this should execute once
			console.log("Account info retrieved:",);
			var balance = doc.get('balance');
			if (balance >0) {
				return balance;
			} else {
				console.log("Balance came back 0 or less");
				return null;
			}
		});
	}).catch(function(error) {
		console.log("Error retrieving account: ", error);
		return
	});
};
//This is a helper function that takes in the transaction array and the queryDate (today's date as a timestamp)
//It returns the balance of the account for today so that we know what the account balance is before we start 
//estimating
function calculateBeforeStart (transactionArray, queryDate) {
	var tempGoal = 0;
	//calculates the balance at the query date
	//may need parseInt if string is returned instread of int
	for each (var transaction in transactionArray) {
		var startDate = transaction.get('startDate');
		if (startDate < queryDate) {
			if (transaction.get('interval') == 0) {
				tempGoal = tempGoal + transaction.get('amount');
			}
			else {
				//since timestamps are stored in miliseconds this gets the difference in miliseconds
				var tempDate = queryDate - startDate; 
				//this converts the miliseconds to days
				var days = parseInt(parseInt(parseInt(parseInt(tempDate /1000)/60)/60)/24);
				//converts the days to how many times this transaction needs to be applied and applies it
				var numberOfActions = parseInt(days/transaction.get('interval');
				tempGoal = tempGoal + (numberofActions * transaction.get('amount');
			}
		}
	}
	return tempGoal;
};

//This is a helper function that is desigend to return the goal of the budget that has had an estimation requested
function retrieveGoal (budgetRef) {
	budgetRef.get().then(function(doc) {
		if (doc.exists) {
			console.log("Document found");
			return doc.data().get('goal');
		} else {
			console.log("No document found to retrieve Goal fron");
			return null;
		}
	}).catch(function(error {
		console.log("Error occured when getting document", error);
		return null;
	});
};

//This function is a helper function that will be used to figure out which transactions
//occur after the start date
function prepareTransactions (transactionArray, queryDate) {
	var laterTransactions = [];
	for each (var transaction in transactionArray) {
		var endDate = transaction.get('endDate');
		if (endDate > queryDate) {
			var tempAmount = transaction.get('amount');
			var tempInterval = transaction.get('interval');
			var tempDaysRemaining = endDate - queryDate;
			tempDaysRemaining = parseInt(parseInt(parseInt(parseInt(tempDaysRemaining/ 1000)/60)/60)/24);
			var tempDaysTillNextTransaction = tempDaysRemaining //if it is a single occurance transaction
			if (tempInterval > 0) {
				var tempDaysTillNextTransaction = tempDaysRemaining % tempInterval; //This covers the possibility that the next transaction is a fraction of the interval
			}
			laterTransaction.push({
				amount: tempAmount,
				interval: tempInterval,
				daysRemaining: tempDaysRemaining,
				daysTillNextTransaction: tempDaysTillNextTransaction
			});
		}
	}
	return laterTransaction;
}

//This is a function that will take in budgetID for which to do estimation 
//it will return how long it will take to reach the goal, or if you will ever reach zero in the course to get your goal
//or it will return that the goal cannot be achieved with in the next (5?) years
var estimate = function estimation (req, res, next) {
	//these refs are created to be passed into the helper functions above
	var budgetRef = req.db.collection('budgets').doc(req.body.budgtID);
	var transactionRef = req.db.collection('budgets').doc(req.body.budgetID).collection('transactions');
	//We only need to access the account to get get the balance
	var accountsRef = req.db.collection('budgets').doc(req.body.budgetID).collection('accounts');
	//create the current date as a timestamp to be passed to helper functions
	var currentDate = Date.now();
	var transactionArray = retrieveAllTransactions(transactionRef);
	var goal = retrieveGoal(budgetRef);
	var balance = retrieveAllBalances(accountRef);
	//This variable should be the balance of the account and budget at the 
	//time that the estimate was requested
	var balanceAtStart = balance + calculateBeforeStart(transactionArray, currentDate);
	var laterTransactions = prepareTransactions(transactionArray, currentDate);
	var daysSinceCurrentDate = 0;
	while( balance <= goal ) {
		for each (transaction in transactionArray) {
			transaction.daysRemaining = transaction.daysRemaining -1;
			transaction.daysTillNextTransaction = transaction.daysTillNextTransaction -1;
			if(transaction.daysTillNextTransaction == 0) {
				balance = balance + transaction.amount;
				transaction.daysTillNextTransaction = transaction.interval
			}
			if (transaction.daysRemaining ==0) {
				var index = transactionArray,indexOf(transaction);
				transactionArray.splice(index,1);
			}
		}
		daysSinceCurrentDate = daysSincecurrentDate +1;
		//have the failsafe here 
		if (daysSinceCurrentDate > 1825) {
			//goal cant be reached in 5 years
		}
	}
	//here is where you return the new date
};
