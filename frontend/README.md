# Frontend for Budge - A Budget Projection App
Budget projection app for CS 428 Winter 2018

To install dependencies:
`npm install`

To install needed tools:
`npm install -g @angular/cli firebase-tools`

To run locally run:
`ng serve`

To deploy a new version to firebase (assuming you have access):
1. Before you can deploy the first time, you have to login to firebase:
`firebase login`
1. Build the application (assuming you've installed the angular CLI above):
`ng build --prod`
1. Deploy to firebase:
`firebase deploy`
 

The live site is running at: https://budgetprojectionapp.firebaseapp.com/
