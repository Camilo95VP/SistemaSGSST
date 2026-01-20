import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importación de compatibilidad

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private afAuth = inject(AngularFireAuth); 
}