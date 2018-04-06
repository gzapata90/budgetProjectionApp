import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import {AngularFireModule} from 'angularfire2';
import { Routes, RouterModule } from '@angular/router';
import {AngularFireDatabaseModule} from 'angularfire2/database';


import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { CreateComponent } from './create/create.component';
import { HomeComponent } from './home/home.component';
import { ActivityComponent } from './activity/activity.component';
import { CoreModule } from './core/core.module';
import { ErrorComponent } from './error/error.component';
import { BudgetComponent } from './budget/budget.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'create', component: CreateComponent},
  {path: 'budget/:user', component: BudgetComponent},
  {path: 'home/:user', component: HomeComponent},
  {path: 'activity/:user', component: ActivityComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '404' },
  {path: '404', component: ErrorComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateComponent,
    HomeComponent,
    ActivityComponent,
    ErrorComponent,
    BudgetComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    RouterModule.forRoot(appRoutes),
    CoreModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
