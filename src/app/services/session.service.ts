import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionsRef = this.db.database.ref('active-sessions');

  constructor(private db: AngularFireDatabase) {}

  /**
   * Verifica si existe una sesión activa para el email dado
   * @param email Email del usuario
   * @returns true si ya existe una sesión activa, false en caso contrario
   */
  async hasActiveSession(email: string): Promise<boolean> {
    const sanitizedEmail = this.sanitizeEmail(email);
    const snapshot = await this.sessionsRef.child(sanitizedEmail).once('value');
    return snapshot.exists();
  }

  /**
   * Registra una nueva sesión activa para el email dado
   * @param email Email del usuario
   * @param sessionId ID único de la sesión (generalmente el UID del usuario)
   */
  async registerSession(email: string, sessionId: string): Promise<void> {
    const sanitizedEmail = this.sanitizeEmail(email);
    await this.sessionsRef.child(sanitizedEmail).set({
      sessionId: sessionId,
      loginTime: Date.now(),
      email: email
    });
  }

  /**
   * Elimina la sesión activa del email dado
   * @param email Email del usuario
   */
  async removeSession(email: string): Promise<void> {
    const sanitizedEmail = this.sanitizeEmail(email);
    await this.sessionsRef.child(sanitizedEmail).remove();
  }

  /**
   * Sanitiza el email para usarlo como clave en Firebase
   * (Firebase no permite ciertos caracteres en las claves)
   * @param email Email a sanitizar
   * @returns Email sanitizado
   */
  private sanitizeEmail(email: string): string {
    return email.replace(/[.#$\[\]]/g, '_');
  }
}
