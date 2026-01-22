import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { SessionService } from 'src/app/services/session.service';
import { AdminService } from 'src/app/services/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any = null;
  message: string = '';
  loading: boolean = false;
  authorizedEmails: string[] = [];
  authorizedEmailsSub?: Subscription;

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private sessionService: SessionService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    // Suscribirse a la lista de correos autorizados en tiempo real
    this.authorizedEmailsSub = this.adminService.getAuthorizedEmailsRealtime().subscribe(emails => {
      this.authorizedEmails = emails;
    });
  }

  ngOnDestroy() {
    this.authorizedEmailsSub?.unsubscribe();
  }

  async loginWithGoogle() {
    this.loading = true;
    this.message = '';
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      this.user = result.user;

      await new Promise(resolve => setTimeout(resolve, 2000));

      const email = this.user?.email || '';

      // Validar solo contra la lista dinámica de Firebase
      if (this.authorizedEmails.includes(email)) {
        const hasSession = await this.sessionService.hasActiveSession(email);
        if (hasSession) {
          this.message = 'No tiene permitido iniciar sesión en este momento';
          await this.afAuth.signOut();
          this.user = null;
        } else {
          await this.sessionService.registerSession(email, this.user.uid);
          if (this.adminService.isAdmin(email)) {
            this.message = `¡Bienvenido Administrador, ${this.user?.displayName || email}!`;
          } else {
            this.message = `¡Bienvenido, ${this.user?.displayName || email}!`;
          }
          this.router.navigate(['/home']);
            sessionStorage.setItem('justLoggedIn', 'true');
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