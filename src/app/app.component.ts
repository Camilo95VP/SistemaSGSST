import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importación de compatibilidad
import { SessionService } from './services/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private afAuth = inject(AngularFireAuth);
  private sessionService = inject(SessionService);
  private authSubscription?: Subscription;
  private currentUserEmail: string | null = null;

  ngOnInit() {
    // Escuchar cambios en el estado de autenticación
    this.authSubscription = this.afAuth.authState.subscribe(user => {
      if (user && user.email) {
        // Usuario inició sesión
        this.currentUserEmail = user.email;
      } else if (this.currentUserEmail) {
        // Usuario cerró sesión - eliminar sesión activa
        this.sessionService.removeSession(this.currentUserEmail);
        this.currentUserEmail = null;
      }
    });

    // Limpiar sesión cuando se cierra la ventana/pestaña
    window.addEventListener('beforeunload', this.cleanupSession.bind(this));
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.cleanupSession();
    window.removeEventListener('beforeunload', this.cleanupSession.bind(this));
  }

  private cleanupSession() {
    if (this.currentUserEmail) {
      // Usar sendBeacon para asegurar que la petición se envíe aunque se cierre la ventana
      this.sessionService.removeSession(this.currentUserEmail);
    }
  }
}