//This function is called whenever a new user is created, It takes in the UID
//of the user and creates a budget and account filled with dummy data
//for the new user
var createUser = function(req, res, next) {
	console.log("In createUser!");
	var date = Date.now();
	console.log("creating a user's data: ", req.body.userID);
	//first create the budget and populate with fake data
	req.db.collection('budgets').add({
		description: "temp",
		name: "temp",
		goal: 0,
		creationDate: date,
		ownerUID: req.body.userID
		
	})
	.then(function(docRef) {
		console.log("Budget Written with ID: ",docRef.id);
		//after the budget has been created we need to create an account
		req.db.collection('budgets').doc(docRef.id).collection('accounts').add({
			name: "temp",
			description: "temp",
			balance: 0
		})
		.then(function(newDocRef) {
			console.log("Account written to budget with ID: ", newDocRef.id);
			return res.status(200).end();
		})
		.catch(function(error) {
			console.error("Error adding account: ", error);
			return res.status(500).end();
		});
	})
	.catch(function(error) {
		console.error("Error adding budget: ", error);
		return res.status(500).end();
	});
};

//This function takes in a budgetID and all of the information that is needed
//to create a single transaction for that budget and adds it to the correct
//budget
var createTransaction = function(req, res, next) {
	var collectionRef = req.db.collection('budgets').doc(req.body.budgetID).collection('transactions');
	
	collectionRef.add({
		endDate: req.body.endDate,
		startDate: req.body.startDate,
		accountID: req.body.accountID, //this may change
		amount: req.body.amount,
		description: req.body.description,
		interval: req.body.interval
	})
	.then(function(docRef) {
		console.log("Transaction written with ID: ", docRef.id);
		return res.status(200).end();
	})
	.catch(function(error) {
		console.error("Error adding transaction: ", error);
		return res.status(500).end();
	});
};

//This function takes in a budgetID of the budget that you would like to
//modify and the goal that you would like to set it too. Returns a 200
//if the goal was updated successfully
var changeGoal = function (req, res, next) {
	var budgetRef = req.db.collection('budgets').doc(req.body.budgetID);
	
	budgetRef.set({
		goal: req.body.goal
	}, {merge: true })
	.then(function() {
		console.log("Goal successfully updated for budget: ",req.body.budgetID);
		return res.status(200).end();
	})
	.catch(function(error) {
		console.error("Error while changing the goal: ",error);
		return res.status(500).end();
	});
};

//This function takes in the budgetID of the budget that needs to be changed
//and all of the information that will be changed in the budget
var changeBudgetInfo = function (req, res, next) {
	var budgetRef = req.db.collection('budgets').doc(req.body.budgetID);
	
	var docData = {};
	if (req.body.description) {
		docData.push({description: req.body.description});
	}
	if (req.body.name) {
		docData.push({name: req.body.name});
	}
	if(req.body.goal) {
		docData.push({goal: req.body.goal});
	}

	budgetRef.set({docData},{merge: true}).then(function() {
		console.log("Budget successfully updated");
		return res.status( 200 );
	})
	.catch(function(error) {
		console.error("Error updating document: ", error);
		return res.status(500).end();
	});
};

var changeAccountInfo = function(req, res, next) {
	var accountRef = req.db.collection('budgets').doc(req.body.budgetID).collection('accounts').doc(req.body.accountID);

	var docData = {};

	if (req.body.description) {
		docData.push({description: req.body.description});
	}
	if (req.body.name) {
		docData.push({name: req.body.name});
	}
	if (req.body.balance) {
		docData.push({balance: req.body.balance});
	}

	accountRef.set({docData},{merge: true}).then(function() {
		console.log("Account successfully updated");
		return res.status(200).end();
	}).catch(function(error) {
		console.error("Error updating document: ", error);
		return res.status(500).end();
	});
};

module.exports = {
	createUser,
	createTransaction,
	changeGoal,
	changeBudgetInfo,
	changeAccountInfo
};
