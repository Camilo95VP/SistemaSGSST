import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
// CAMBIO: Importamos la versión compat
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AdminService } from '../services/admin.service';
import { map, take, switchMap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  // Inyectamos AngularFireAuth y AdminService
  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private adminService: AdminService
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Usamos authState que es el observable estándar de la versión compat
    return this.afAuth.authState.pipe(
      take(1),
      switchMap(async firebaseUser => {
        if (firebaseUser && firebaseUser.email) {
          // Obtener lista actualizada de correos autorizados desde Firebase
          const authorizedEmails = await this.adminService.getAuthorizedEmails();
          
          if (authorizedEmails.includes(firebaseUser.email)) {
            return true;
          }
        }
        // Si no está logueado o no es correo autorizado, va al login
        return this.router.createUrlTree(['']); 
      })
    );
  }
}