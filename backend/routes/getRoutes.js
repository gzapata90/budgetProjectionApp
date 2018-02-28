var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var serviceAccount = require('budgetappAdminKey.json');

admin.initalizeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:'https://console.firebase.google.com/u/0/project/budgetprojectionapp/database/firestore/data~2F.firestore.io'
});
