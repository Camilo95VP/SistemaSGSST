import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { environment } from 'src/environments/environments';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return from(Promise.resolve(this.auth.currentUser)).pipe(
      map(user => {
        if (user && user.email && environment.authorizedEmails.includes(user.email)) {
          return true;
        }
        return this.router.createUrlTree(['']);
      })
    );
  }
}
