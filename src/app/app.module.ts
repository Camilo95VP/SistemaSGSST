import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// --- IMPORTACIONES DE COMPATIBILIDAD (SOLUCIÓN DEFINITIVA) ---
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environments';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Componentes
import { PlanearComponent } from './components/pages/planear/planear.component';
import { HomeComponent } from './components/shared/home/home.component';
import { HacerComponent } from './components/pages/hacer/hacer.component';
import { VerificarComponent } from './components/pages/verificar/verificar.component';
import { ActuarComponent } from './components/pages/actuar/actuar.component';
import { NavBarComponent } from './components/shared/navBar/navBar.component';
import { LoginComponent } from './components/shared/login/login.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

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
    HttpClientModule,
    FormsModule,
    // La inicialización vía AngularFireModule garantiza que 
    // todos los componentes internos de Firebase se registren al arrancar.
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }