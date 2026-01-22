import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SessionService } from 'src/app/services/session.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css']
})
export class NavBarComponent implements OnInit {
  user: any = null; 
  mostrarConfirmacionLogout: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private sessionService: SessionService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      this.user = user;
      // Verificar si el usuario es administrador
      if (user && user.email) {
        this.isAdmin = this.adminService.isAdmin(user.email);
      } else {
        this.isAdmin = false;
      }
    });
  }

  confirmarLogout() {
    this.mostrarConfirmacionLogout = true;
  }

  async logout() {
    try {
      // Eliminar la sesión activa antes de cerrar sesión
      if (this.user?.email) {
        await this.sessionService.removeSession(this.user.email);
      }
      await this.afAuth.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      window.location.href = '/';
    }
  }
}