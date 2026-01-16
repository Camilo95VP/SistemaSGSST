
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlanearComponent } from './components/pages/planear/planear.component';
import { HomeComponent } from './components/shared/home/home.component';
import { HacerComponent } from './components/pages/hacer/hacer.component';
import { VerificarComponent } from './components/pages/verificar/verificar.component';
import { ActuarComponent } from './components/pages/actuar/actuar.component';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [	
    AppComponent,
    HomeComponent,
      PlanearComponent,
      HacerComponent,
      VerificarComponent,
      ActuarComponent
   ],
   
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
