var fs = require('fs');
var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');

var serviceAccount;
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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:'https://console.firebase.google.com/u/0/project/budgetprojectionapp/database/firestore/data~2F.firestore.io'
});

var db = admin.firestore();

// This is a middleware function to make sure that the user is authenticated correctly
router.use(function (req, res, next) {
  admin.auth().verifyIdToken(req.headers.authorization).then(function(user) {
    if(!user) return res.status(401).end();
    req.user = user;
    next();
  }, function(error) {
    return res.status(500).end();
  })
})

router.use(function(req,res,next) {
  req.db = db;
  next();
})
//TODO: Add request input validation

var getFunctions = require('./getRoutes');
//These are all just IDs from firebase, and handle some backend logic around grabbing the :userID and such out of routes below
router.param('userID', getFunctions.userIDParam);
router.param('budgetID', getFunctions.budgetIDParam);
router.param('accountID', getFunctions.accountIDParam);
router.param('transactionID', getFunctions.transactionIDParam);

//Grabs all budgets for the given user, does not include accounts/transactions
router.get('/:userID/budgets', getFunctions.getBudgets);
//Grabs the specified budget object - does not include accounts/transactions
router.get('/:budgetID', getFunctions.getBudget);
//Grabs the transactions from the specified budget - returns an array of transactions
router.get('/:budgetID/transactions', getFunctions.getTransactions);
//Grabs a specific transaction for a budget
router.get('/:budgetID/transaction/:transactionID', getFunctions.getTransaction);
//Grabs the account information for the specified account 
//TODO: there currently isn't a way to get the accounts for a budget, so we'll have to add that
router.get('/:budgetID/account/:accountID', getFunctions.getAccount);
//This route should be called with query params: ?startDate=[Date]&endDate=[Date]
//Dates should be a number of milliseconds since the epoch (aka new Date("03/22/2018").getTime() type values)
//Should return an array of transaction objects that are within the time range
router.get('/:budgetID/transactionRange/', getFunctions.getTransactionRange);

var deleteFunctions = require('./deleteRoutes');
router.delete('/:budgetID/transaction/:transactionID', deleteFunctions.deleteTransaction);
//Does not presently delete the actual budget, just the transactions and arrays
//TODO: activate deleting budget logic
router.delete('/:budgetID', deleteFunctions.deleteBudget);

var postPutFunctions = require('./postPutRoutes');
//This should be called after creating a user should return the budget and account IDs that were created
router.post('/user', postPutFunctions.createUser);
//This adds a transaction to the specified budget and returns the new transaction
//Should include a request body/data object like the following:
/**
 * {
 *  endDate: number of milliseconds since the epoch
 *  startDate: number of milliseconds since the epoch
 *  accountID: string
 *  amount: number (positive or negative)
 *  description: string
 *  interval: number (0 or greater)
 * }
 */
router.post('/:budgetID/transaction', postPutFunctions.createTransaction);

//This route is utilized to update description, name, or goal of a budget and doesn't return anything
router.put('/:budgetID', postPutFunctions.changeBudgetInfo)
//This changes the information associated with an account - description, name, balance and doesn't return anything
router.put('/:budgetID/account', postPutFunctions.changeAccountInfo)
//This changes the goal amount for a budget and doesn't return anything
router.put('/:budgetID/goal', postPutFunctions.changeGoal)

/* GET home page. */
router.get('/', function(req, res, next) {
  //This is basically here so that we can check to make sure the app is running still
  res.status(200).send("<html><body><h1>Hello!</h1></body></html>");
});

module.exports = router;
