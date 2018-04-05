
//This route expects the caller to pass in the userID so that we are able
//to return all of the budgets that this user is associated with
//it will return an array of maps (for the MVP it should be a one element array)
// router.get('/userID/budgets',
var getBudgets = function (req, res, next) {
	var budgetsRef = req.db.collection('budgets').where("ownerUID", "==", req.body.userID);
	var budgetsArray = []; // this array will hold all of the budgets of this user
	budgetsRef.get().then(function (querySnapshot) {
		querySnapshot.forEach(function (doc) {
			budgetsArray.push(doc.data());
		});
		//if the first branch executes we have a problem
		if (budgetsArray.length < 1) {
			console.log("BudgetsArray was 0, we have a problem with either not creating a budget for this user, not saving the UID correctly in the budget, not retrieving correctly, or deleted a budget without deleting a user");
			return res.status(500).end();
		}
		else {
			console.log("Sending a budgetsArray with length: ", budgetsArray.length);
			return res.status(200).json(budgetsArray);
		}

	}).catch(function (error) {
		console.log("Error getting documents: ", error);
		return res.status(500).end();
	}); //end of budget collection 

};
//This route expects the caller to pass in the budgetID of the budget 
//that they would like for us to retrieve
//it then takes that ID and acceses the database and returns the data on that 
//budget as a map:
// router.get('/budgetID', 
var getBudget = function (req, res, next) {
	var budgetRef = req.db.collection('budgets').doc(req.body.budgetID);
	budgetRef.get().then(function (doc) {
		if (doc.exists) {
			//document was found
			console.log("retrieved budget succesfully");
			//send back the data as a json object
			return res.status(200).json(doc.data()); 
		} else {
			//document was not found
			console.log("No document found with that budgetID");
			return res.status(404).end();
		}
	}).catch(function (error) {
		console.log("Error Getting document: ", error);
		return res.status(500).end();
	});
};

//This route expects the caller to pass in a budgetID and a transactionID
//these are the IDs of a specific transaction in a specific budget that
//they would like to be retrieved
//The transaction data will be returned as a map
// router.get('/budgetID/transactionID', 
var getTransaction = function (req, res, next) {
	var transactionRef = req.db.collection('budgets').doc(req.body.budgetID).collection('transactions').doc(req.body.transactionID)

	transactionRef.get().then(function (doc) {
		if (doc.exists) {
			console.log("retrieved transaction succesfully");
			return res.status(200).json(doc.data());
		} else {
			console.log("No document found with that transactionID")
			return res.status(404).end();
		}
	}).catch(function (error) {
		console.log("Error getting document: ".error);
		return res.status(500).end();
	});
};

//This route expects the caller to pass in a budgetID of the budget they
//would like to retrieve all of the transactions for
//The list of transactions will be returned as an array of transaction objects in a map
// router.get('/budgetID/transactions', 
var getTransactions = function (req, res, next) {
	var transactionsRef = req.db.collection('budgets').doc(req.body.budgetID).collection('transactions');

	var transactionArray = []; //the array of transactions that will be returned

	transactionsRef.get().then(function (querySnapshot) {
		querySnapshot.forEach(function (doc) {
			transactionArray.push(doc.data());
		});
		if (transactionArray.length < 1) {
			console.log("No transactions found, either no transactions have been added, transactions were not retrieved correctlly, or The budgetID was wrong");
			return res.status(500).end();
		}
		console.log("Sending an array of transactions with length: ", transactionArray.length);
		return res.status(200).json(transactionArray);
	})
		.catch(function (error) {
			console.log("Error getting documents: ", error);
			return res.status(500).end();
		});
};

//This route expects the caller to pass in an accountID and a budgetID which
//it will then use to access the specified account from the specified budget
//and return the information for that specific account as a map
// router.get('/budgetID/accountID', 
var getAccount = function (req, res, next) {
	var accountRef = req.db.collection('budgets').doc(req.body.budgetID).collection('accounts').doc(req.body.accountID);

	accountRef.get().then(function (doc) {
		if (doc.exists) {
			//account was found
			console.log("Retrieved account succesfully")
			//send the data back as a json object
			return res.status(200).json(doc.data()); 
		} else {
			//document not found
			console.log("No document was found with that accountID")
			return res.status(404).end();
		}

	}).catch(function (error) {
		console.log("Error Getting document: ", error);
		return res.status(500).end();
	});
};

//This route expects the caller to pass in a budgetID and a start 
//and end date for what date range they want to access transactions from.
//It will return a list of transactions corresponding to the date range that
//is given
// router.get('/budgetID/transactionRange/', 
var getTransactionRange = function (req, res, next) {
	var transactionRef = req.db.collection('budgets').doc(req.body.budgetID).collection('transactions');

	var transactionArray = [];
	transactionRef.where("startDate", '<=', req.query.endDate).get()
		.then(function (querySnapshot) {
			querySnapshot.forEach(function (doc) {
				//doc should be a map
				var testEnd = doc.get("endDate");
				if (testEnd >= req.query.startDate) {
					transactionArray.push(doc.data());
				}
			});
			if(transactionArray.length < 1) {
				console.log("No transactions matched the range?");
				return res.status(404).end();
			}
			console.log("Sending back an array of transactions with length: ", transactionArray.length);
			return res.status(200).json(transactionArray);
		})
		.catch(function (error) {
			console.log("Error getting documents: ", error);
			return res.status(500).end();
		});

	return transactionArray;
};

var userIDParam = function (req, res, next, id) {
	req.body.userID = id;
	next();
}

var budgetIDParam = function (req, res, next, id) {
	req.body.budgetID = id;
	next();
}
var accountIDParam = function (req, res, next, id) {
	req.body.accountID = id;
	next();
}
var transactionIDParam = function (req, res, next, id) {
	req.body.transactionID = id;
	next();
}

module.exports = {
	getBudgets,
	getBudget,
	getTransactions,
	getTransaction,
	getAccount,
	getTransactionRange,
	budgetIDParam,
	accountIDParam,
	userIDParam,
	transactionIDParam
};
