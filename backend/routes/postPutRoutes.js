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

var createTransaction = function(req, res, next) {

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
