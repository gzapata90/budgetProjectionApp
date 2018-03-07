# Backend for Budge - A Budget Projection App
Budget projection app for CS 428 Winter 2018

To install dependencies:
`npm install`

To run locally:

1. Install heroku CLI if you want to simulate the prod environment. To do so go here: `https://devcenter.heroku.com/articles/heroku-cli`
    1. When you install this the first time, log in to heroku by running 
    `heroku apps` and it should output this app as one you have access to
    1. After you have verified access to the app on heroku, make sure that your local git has a remote set up for heroku: 
    `heroku git:remote --app budget-projection-app`
1. Once installed, run `heroku local` from the root folder (the one with the `Procfile` in it) and it should start up.

If you don't care about that, you can just run `npm start` in this folder after you've installed the dependencies.

The heroku app dashboard is here (for those with access): https://dashboard.heroku.com/apps/budget-projection-app

It runs here: https://budget-projection-app.herokuapp.com/


