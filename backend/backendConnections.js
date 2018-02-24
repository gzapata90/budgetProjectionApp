const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

var db = admin.firestore();
var express = require('express');
var router = express.Router();

function createUser(username,password,email)
{
	firebase.auth().createUserWithEmailAndPassword(email,password).then(function() {
	
	//create the information in the database
	var user = firebase.auth().currentUser.uid
	var docRef = db.collection('users').doc(user);
	var setUser = docRef.set({
		uid: user, 
		name: email
	});
	
}

function signInUser(email, password)
{
	firebase.auth().signInWithEmailAndPassword(email,password).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		if(errorCode ==='auth/wrong-password') {
			alert('Wrong password.');
		}	else {
			alert(errorMessage);
		}
	});
}

function signOutUser()
{
	if (firebase.auth().currentUser)
	{
		firebase.auth().signOut();
	}
}

//placeholder function to deal with adding an account
function addAccount()
{
}

//place holder for adding a budgetary function
//Can we add account and budgets as objects
function addBudget(userID)
{
	//This function should probably call addAccount
	//budget goal should be set to NULL/ 0
}

//place holder to add transaction
function addTransaction(budgetID)
{
	//this will add a transaction to a single budget //account
	//this will also change the balance of the budget/account
}

//place holder to change goal on a budget
function changeGoal(goal, budgetID)
{
	//add the goal to the specific budget	
}

//place holder to remove transaction from a budget
function removeTransaction(transactionID,budgetName)
{
	db.collection("budgets").doc(budgetName).collection("transactions").doc(transactionID).delete().then(function() {
		console.log("Transaction successfully deleted!");
	}).catch(function(error){
		console.error("Error removing document: ", error);
	});
	
}

//place holder to remove budget
function removeBudget(budgetName)
{
}

//place holder to remove account
function removeAccount(acountID)
{
}

//get transaction information from an account
function retrieveAllTransactions(budgetID)
{
	//gets the tansactions from a specific budget
}

//get budget info
function retrieveBudgetInfo(budgetID)
{
}

function retrieveTransactionInfo(transactionID)
{

}

