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

});

//This route expects the caller to pass in the budgetID of the budget that needs to be
//deleted. The budget and all subsequent accounts and transactions will be delted as well.
//This function will return true if it is deleted correctly and false otherwise
router.delete('/budgetID', function(req,res,next) {

});
module.exports = router;
