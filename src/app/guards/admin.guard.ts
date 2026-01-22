import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AdminService } from '../services/admin.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private adminService: AdminService
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.afAuth.authState.pipe(
      take(1),
      map(firebaseUser => {
        if (firebaseUser && firebaseUser.email) {
          // Verificar si es administrador
          if (this.adminService.isAdmin(firebaseUser.email)) {
            return true;
          }
          // Si está autenticado pero no es admin, redirigir a home
          return this.router.createUrlTree(['/home']);
        }
        // Si no está autenticado, redirigir al login
        return this.router.createUrlTree(['']);
      })
    );
  }
}
