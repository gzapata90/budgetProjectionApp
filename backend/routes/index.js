var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var serviceAccount = require('budgetappAdminKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:'https://console.firebase.google.com/u/0/project/budgetprojectionapp/database/firestore/data~2F.firestore.io'
});
var db = admin.firestore();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/createUser', function(req,res,next) {
  admin.auth().createUser({
    email: req.body.email,
    password: req.body.password
  })
    .then(function(userRecord) {
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch(function(error) {
      console.log("error creating new user:", error);
    })
});


module.exports = router;
