//This function is called whenever a new user is created, It takes in the UID
//of the suer and creates a budget and account filled with dumby data
// for the new user
var createUser = function(req, res, next) {
	var date = new Date.now();
	db.collection('budgets').add({
		description: "temp",
		name: "temp",
		goal: 0,
		creation date: date,
		ownerUID: req.body.UID
		
	})
	.then(function(docRef) {
		console.log("Budget Written with ID: ",docRef.id);
		db.collection('budgets').doc(docRef.id).collection('accounts').add({
			name: "temp",
			description: "temp",
			balance: 0
		})
		.then(function(newDocRef) {
			console.log("Account written to budget with ID: " newDocRef.id);
			return res.status(200);
		})
		.catch(function(error) {
			console.error("Error adding account: ", error);
			return res.status(500);
		});
	})
	.catch(function(error) {
		console.error("Error adding budget: ", error);
		return res.status(500);
	});
};

//This function takes in a budgetID and all of the information that is needed
//to create a single transaction for that budget and adds it to the correct
//budget
var createTransaction = function(req, res, next) {
	var collectionRef = db.collection('budgets').doc(req.body.budgetID).collection('transactions');
	
	collectionRef.add({
		End date: req.body.endDate,
		Start date: req.body.startDate,
		accountID: req.body.accountID, //this may change
		amount: req.body.amount,
		description: req.body.description,
		interval:, req.body.interval
	})
	.then(function(docRef) {
		console.log("Transaction written with ID: ", docRef.id);
		return res.status(200);
	})
	.catch(function(error) {
		console.error("Error adding transaction: ", error);
	});
};

var changeGoal = function (req, res, next) {

};

var changeBudgetInfo = function (req, res, next) {

};

var changeAccountInfo = function(req, res, next) {

};

module.exports = {
	createUser,
	createTransaction,
	changeGoal,
	changeBudgetInfo,
	changeAccountInfo
}
