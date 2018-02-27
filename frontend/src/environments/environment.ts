// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCClSXaE4fgGClhZP7Bu-9o0VBaM1sFln8",
    authDomain: "budgetprojectionapp.firebaseapp.com",
    databaseURL: "https://budgetprojectionapp.firebaseio.com",
    projectId: "budgetprojectionapp",
    storageBucket: "budgetprojectionapp.appspot.com",
    messagingSenderId: "955213044742"
  }
};
