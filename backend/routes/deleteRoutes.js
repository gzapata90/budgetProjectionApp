var fs = require('fs');
var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var serviceAccount = require('budgetappAdminKey.json');

admin.initalizeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:'https://console.firebase.google.com/u/0/project/budgetprojectionapp/database/firestore/data~2F.firestore.io'
});

var db = admin.firestore();

var servuceAccount;
if (fs.existsSync('budgetappAdminKey.json')) {
  serviceAccount  = require('../budgetappAdminKey.json'); //different path since it is from this file, not where the code is running
}
else if(process.env.PROJECT_ID) {
  //We're assuming that if one of the env vars is set, they'll all be set
  serviceAccount = {
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    type: process.env.TYPE,
    privateKeyId: process.env.PRIVATE_KEY_ID,
    clientId: process.env.CLIENT_ID,
    authUri: process.env.AUTH_URI,
    tokenUri: process.env.TOKEN_URI,
    authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertIrl: process.env.CLIENT_X509_CERT_URL
  }
}
else {
  //You done messed up.
  serviceAccount = {};
}

router.get('/', function(req,res,next) {
  res.status(200).send('<html><body><h1>Hello</h1></body></html>');
});

//This route expects the caller to pass in the budgetID of the budget that needs to 
//be deleted from, and the transactionID of the transaction that needs to be deleted
//it will return true if the transaction is deleted, false otherwise
router.delete('/budgetID/transactionID', function(req,res,next) {
	var transactionRef = db.collection('budgets').doc(req.body.budgetID).collection('transactions').doc(req.body.budgetID);

	transactionRef.delete().then(function() {
		console.log("Document successfully deleted!");
		return true;
	}).catch(function(error) {
		console.error("Error deleteing document: ", error);
	});
	return false;
});

//This route expects the caller to pass in the budgetID of the budget that needs to be
//deleted. The budget and all subsequent accounts and transactions will be delted as well.
//This function will return true if it is deleted correctly and false otherwise
router.delete('/budgetID', function(req,res,next) {

	function deleteQueryBatch(db, query,batchSize, resolve, reject) {
		query.get().then((snapshot => {
			if (snapshot.size == 0) {
				return 0;
			}
			var batch = db.batch();
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
		}).catch(reject);
	};

	function deleteCollection(db, collectionPath, batchSize) {
		var query = collectionRef.orderBy('__name__').limit(batchSize);
		return new Promise((resolve, reject) => {
			deleteQueryBatch(db, query, batchSize, resolve, reject);
		});
	};

	const batchSize =10; //arbitrary batchSize can be changed as needed
	//variables to each of the different things we need to delete
	var budgetRef = db.collection('budgets').doc(req.body.budgetID);
	var transactionsRef = db.collection('budgets').doc(req.body.budgetID).collection('transactions');
	var accountRef = db.collection('budgets').doc(req.body.budgetID).collection('accounts');

	//deleting the transaction
	//probably need some sort of testing for this
	deleteCollection(db, transactionsRef, batchSize);
	deleteCollection(db, accountsRef, batchSize);

	//delete the acctual budget
	/*I am leaving the code to delete the budget itself commented out so that we can test to make sure taht the collections are getting deleted correctly and not losing the budget that they are connected to, once we have tested to make sure taht the collections are deleted un comment this code and test to make sure that the budget gets deleted correctly
	budgetRef.delete();
	budgetRef.get().then(doc => {
		if( !doc.exists) {
			console.log('Delete was succesful');
		} else {
			console.log('There was an error deleting');
		}.catch(err => {
			console.log('Error getting document: ', err); 
		});
	});
	*/

});
module.exports = router;
