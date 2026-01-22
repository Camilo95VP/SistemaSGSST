import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

// IMPORTACIONES DE COMPATIBILIDAD
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; // Necesario para el GoogleAuthProvider
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any = null;
  message: string = '';
  loading: boolean = false;

  // Inyectamos AngularFireAuth (Compat) y SessionService
  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private sessionService: SessionService
  ) { }

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
        // Verificar si ya existe una sesión activa para este correo
        const hasSession = await this.sessionService.hasActiveSession(email);
        
        if (hasSession) {
          // Si ya existe una sesión activa, cerrar sesión y mostrar error
          this.message = 'No tiene permitido iniciar sesión en este momento';
          await this.afAuth.signOut();
          this.user = null;
        } else {
          // Si no existe sesión activa, registrar la nueva sesión
          await this.sessionService.registerSession(email, this.user.uid);
          this.message = `¡Bienvenido, ${this.user?.displayName || email}!`;
          this.router.navigate(['/home']);
        }
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