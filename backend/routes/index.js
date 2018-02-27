var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var serviceAccount = require('../budgetappAdminKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("<html><body><h1>Hello!</h1></body></html>");
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
