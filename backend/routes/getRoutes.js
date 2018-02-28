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


//This route expects the caller to pass in the userID so that we are able
//to return all of the budgets that this user is associated with
//it will return an array of maps (for the MVP it should be a one element array)
router.get('/userID/budgets',function(req,res,next) {

});
//This route expects the caller to pass in the budgetID of the budget 
//that they would like for us to retrieve
//it then takes that ID and acceses the database and returns the data on that 
//budget as a map
router.get('/budgetID', function(req,res,next) {
  var budgetRef = db.collection('budgets').doc(req.body.budgetID);
  
  docRef.get().then(function(doc) {
      if (doc.exists) { 
	//document was found
      	console.log("retrieved budget succesfully")
	return doc.data(); //send back the data as a json object
      } else {
      	//document was not found
	console.log("No document found with that budgetID")
      }
      
 }).catch(function(error) {
     console.log("Error Getting document: ", error); 
 })
});

//This route expects the caller to pass in a budgetID and a transactionID
//these are the IDs of a specific transaction in a specific budget that
//they would like to be retrieved
//The transaction data will be returned as a map
router.get('/budgetID/transactionID', function(req,res,next) {

});

//This route expects the caller to pass in a budgetID of the budget they
//would like to retrieve all of the transactions for
//The list of transactions will be returned as an array of transaction objects in a map
router.get('/budgetID/transactions', function(req,res,next) {
	var transactionsRef =db.collection('budgets').doc(req.body.budgetID).collection('transactions');
	
	var transactionsArray[]; //the array of transactions that will be returned

	transactionRef.get().then(function(querySnapshot){
		querySnapshot.forEach(function(doc) {
			
		});
	});
});

//This route expects the caller to pass in an accountID and a budgetID which
//it will thean use to access the specified account from the specified budget
//and return the information for that specific account as a map
router.get('/budgetID/accountID', function(req, res, next) {
	var accountRef=db.collection('budgets').doc(req.body.budgetID).collection('accounts').doc(req.body.accountID);
	
	accountRef.get().then(function(doc) {
		if(doc.exists) {
			//account was found
			console.log("Retrieved account succesfully")
			return doc.data(); //send the data back as a json object
		} else {
			//document not found
			console.log("No document was found with that accountID")
		}

	}).catch(function(error) {
		console.log("Error Getting document: ", error);
	})
});
