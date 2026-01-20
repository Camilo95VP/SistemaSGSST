import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

// IMPORTACIONES DE COMPATIBILIDAD
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; // Necesario para el GoogleAuthProvider

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any = null;
  message: string = '';
  loading: boolean = false;

  // Inyectamos AngularFireAuth (Compat)
  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {}

  async loginWithGoogle() {
    this.loading = true;
    this.message = '';
    try {
      // Usamos el provider desde el namespace de compatibilidad
      const provider = new firebase.auth.GoogleAuthProvider();
      
      // La versión compat usa el método directamente desde la instancia inyectada
      const result = await this.afAuth.signInWithPopup(provider);
      this.user = result.user;

      // Mostrar validando permisos durante 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));

      const email = this.user?.email || '';
      
      if (environment.authorizedEmails.includes(email)) {
        this.message = `¡Bienvenido, ${this.user?.displayName || email}!`;
        this.router.navigate(['/home']);
      } else {
        this.message = 'Usuario/correo no autorizado.';
        await this.afAuth.signOut();
        this.user = null;
      }
    } catch (error: any) {
      console.error(error);
      this.message = 'Error en el inicio de sesión.';
    }
    this.loading = false;
  }
}