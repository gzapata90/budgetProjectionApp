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

//This is a middleware function to make sure that the user is authenticated correctly
// router.use(function (req, res, next) {
// 	if (!admin.auth().verifyIdToken(req.header.Authorization)) return next('router');
// 	next();
// })

router.use(function(req,res,next) {
  req.db = db;
  next();
})

var getFunctions = require('./getRoutes');
router.param('userID', getFunctions.userIDParam);
router.param('budgetID', getFunctions.budgetIDParam);
router.param('accountID', getFunctions.accountIDParam);
router.param('transactionID', getFunctions.transactionIDParam);
router.get('/:userID/budgets', getFunctions.getBudgets);
router.get('/:budgetID', getFunctions.getBudget);
router.get('/:budgetID/transactions', getFunctions.getTransactions);
router.get('/:budgetID/transaction/:transactionID', getFunctions.getTransaction);
router.get('/:budgetID/account/:accountID', getFunctions.getAccount);
router.get('/:budgetID/transactionRange/', getFunctions.getTransactionRange);

var deleteFunctions = require('./deleteRoutes');
router.delete('/:budgetID/transaction/:transactionID', deleteFunctions.deleteTransaction);
router.delete('/:budgetID', deleteFunctions.deleteBudget);

/* GET home page. */
router.get('/', function(req, res, next) {
  //This is basically here so that we can check to make sure the app is running still
  res.status(200).send("<html><body><h1>Hello!</h1></body></html>");
});

router.post('/createUser', function(req,res,next) {
  //This should be updated to create a budget and starter account for the user

  // admin.auth().createUser({
  //   email: req.body.email,
  //   password: req.body.password
  // })
  //   .then(function(userRecord) {
  //     console.log("Successfully created new user:", userRecord.uid);
  //   })
  //   .catch(function(error) {
  //     console.log("error creating new user:", error);
  //   })
});


module.exports = router;
