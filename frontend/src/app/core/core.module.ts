import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ServerService } from './server.service';

import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [AuthService, ServerService]
})
export class CoreModule { }
