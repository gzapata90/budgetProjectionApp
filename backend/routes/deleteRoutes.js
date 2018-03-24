



//This route expects the caller to pass in the budgetID of the budget that needs to 
//be deleted from, and the transactionID of the transaction that needs to be deleted
//it will return true if the transaction is deleted, false otherwise
// router.delete('/budgetID/transactionID', 
var deleteTransaction = function(req,res,next) {
	var transactionRef = req.db.collection('budgets').doc(req.body.budgetID).collection('transactions').doc(req.body.budgetID);

	transactionRef.delete().then(function() {
		console.log("Document successfully deleted!");
		res.status(200);
		return;
	}).catch(function(error) {
		console.error("Error deleting document: ", error);
		res.status(500);
		return;
	});
	return false;
};

//This route expects the caller to pass in the budgetID of the budget that needs to be
//deleted. The budget and all subsequent accounts and transactions will be delted as well.
//This function will return true if it is deleted correctly and false otherwise
// router.delete('/budgetID', 
var deleteBudget = function(req,res,next) {

	function deleteQueryBatch(db, query,batchSize, resolve, reject) {
		query.get().then((snapshot) => {
			if (snapshot.size == 0) {
				return 0;
			}
			var batch = req.db.batch();
			snapshot.docs.forEach((doc) => {
				batch.delete(doc.ref);
			});
			return batch.commit().then(() => {
				return snapshot.size;
			});
		}).then((numDeleted) => {
			if (numDeleted === 0) {
				resolve();
				return;
			}
			//recurse on the next process tick to avoid exploding stack
			process.nextTick(() => {
				deleteQueryBatch(db, query, batchSize, resolve, reject)
			});
		}).catch(reject)
	}

	function deleteCollection(db, collectionPath, batchSize) {
		var query = collectionRef.orderBy('__name__').limit(batchSize);
		return new Promise((resolve, reject) => {
			deleteQueryBatch(db, query, batchSize, resolve, reject);
		});
	};

	const batchSize = 10; //arbitrary batchSize can be changed as needed
	//variables to each of the different things we need to delete
	var budgetRef = req.db.collection('budgets').doc(req.body.budgetID);
	var transactionsRef = req.db.collection('budgets').doc(req.body.budgetID).collection('transactions');
	var accountRef = req.db.collection('budgets').doc(req.body.budgetID).collection('accounts');

	//deleting the transaction
	//probably need some sort of testing for this
	var transactionsPromise = deleteCollection(req.db, transactionsRef, batchSize);
	var accountsPromise = deleteCollection(req.db, accountsRef, batchSize);
	Promise.all([transactionsPromise, accountsPromise]).then(function(results) {
		res.status(200);
		return;
	});
	/*I am leaving the code to delete the budget itself commented out so that we can test to make sure taht the collections are getting deleted correctly and not losing the budget that they are connected to, once we have tested to make sure taht the collections are deleted un comment this code and test to make sure that the budget gets deleted correctly

		//delete the acctual budget
		budgetRef.delete();
		budgetRef.get().then(doc => {
			if( !doc.exists) {
				console.log('Delete was succesful');
				res.status(200);
				return;
			} else {
				console.log('There was an error deleting');
				return res.status(500).end();
			}.catch(err => {
				console.log('Error getting document: ', err);
				return res.status(500).end(); 
			});
		});
	})
	*/

};
module.exports = {
	deleteBudget,
	deleteTransaction
};
