import { Component, OnInit } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, User } from '@angular/fire/auth';
import { environment } from 'src/environments/environments';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User | null = null;
  message: string = '';
  loading: boolean = false;

  constructor(private auth: Auth, private router: Router) { }

  ngOnInit() {}

  async loginWithGoogle() {
    this.loading = true;
    this.message = '';
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.user = result.user;
      // Mostrar validando permisos durante 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));
      const email = this.user.email || '';
      if (environment.authorizedEmails.includes(email)) {
        this.message = `¡Bienvenido, ${this.user.displayName || email}!`;
        this.router.navigate(['/home']);
      } else {
        this.message = 'Usuario/correo no autorizado.';
        await this.auth.signOut();
        this.user = null;
      }
    } catch (error: any) {
      this.message = 'Error en el inicio de sesión.';
    }
    this.loading = false;
  }
}
