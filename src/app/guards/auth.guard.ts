import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
// CAMBIO: Importamos la versión compat
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environments';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  // Inyectamos AngularFireAuth en lugar de Auth
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Usamos authState que es el observable estándar de la versión compat
    return this.afAuth.authState.pipe(
      take(1),
      map(firebaseUser => {
        if (firebaseUser && firebaseUser.email && environment.authorizedEmails.includes(firebaseUser.email)) {
          return true;
        }
        // Si no está logueado o no es correo autorizado, va al login
        return this.router.createUrlTree(['']); 
      })
    );
  }
}