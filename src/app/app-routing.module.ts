import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/shared/home/home.component';
import { PlanearComponent } from './components/pages/planear/planear.component';
import { HacerComponent } from './components/pages/hacer/hacer.component';
import { VerificarComponent } from './components/pages/verificar/verificar.component';
import { ActuarComponent } from './components/pages/actuar/actuar.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'planear', component: PlanearComponent },
  { path: 'hacer', component: HacerComponent },
  { path: 'verificar', component: VerificarComponent },
  { path: 'actuar', component: ActuarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
