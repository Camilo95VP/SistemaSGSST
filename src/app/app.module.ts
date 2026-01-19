
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environments';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlanearComponent } from './components/pages/planear/planear.component';
import { HomeComponent } from './components/shared/home/home.component';
import { HacerComponent } from './components/pages/hacer/hacer.component';
import { VerificarComponent } from './components/pages/verificar/verificar.component';
import { ActuarComponent } from './components/pages/actuar/actuar.component';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './components/shared/navBar/navBar.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/shared/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlanearComponent,
    HacerComponent,
    VerificarComponent,
    ActuarComponent,
    NavBarComponent,
    LoginComponent 
  ],
   
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth())
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
