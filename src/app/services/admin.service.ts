import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private authorizedEmailsRef = this.db.database.ref('authorized-emails');

  constructor(private db: AngularFireDatabase) {
    this.initializeAuthorizedEmails();
  }

  /**
   * Verifica si un email es administrador
   */
  isAdmin(email: string | null): boolean {
    if (!email) return false;
    return environment.authorizedAdmins.includes(email);
  }

  /**
   * Verifica si un email está autorizado usando la lista dinámica de Firebase
   */
  isAuthorized(email: string | null, authorizedList: string[]): boolean {
    if (!email) return false;
    return authorizedList.includes(email);
  }

  /**
   * Inicializa la lista de correos autorizados en Firebase si no existe
   */
  private async initializeAuthorizedEmails() {
    try {
      const snapshot = await this.authorizedEmailsRef.once('value');
      if (!snapshot.exists()) {
        // Si no existe, inicializar con los emails del environment
        const emailsObject: any = {};
        environment.authorizedEmails.forEach((email, index) => {
          emailsObject[this.sanitizeEmail(email)] = {
            email: email,
            addedAt: Date.now(),
            addedBy: 'system'
          };
        });
        await this.authorizedEmailsRef.set(emailsObject);
        console.log('Lista de correos autorizados inicializada en Firebase');
      }
    } catch (error) {
      console.error('Error inicializando correos autorizados en Firebase:', error);
      console.warn('La aplicación funcionará con la lista del environment');
    }
  }

  /**
   * Obtiene la lista de correos autorizados desde Firebase (una vez)
   */
  async getAuthorizedEmails(): Promise<string[]> {
    try {
      const snapshot = await this.authorizedEmailsRef.once('value');
      const data = snapshot.val();
      if (!data) {
        console.warn('No se encontraron correos en Firebase, usando lista del environment');
        return environment.authorizedEmails;
      }
      
      return Object.values(data).map((item: any) => item.email);
    } catch (error) {
      console.error('Error obteniendo correos autorizados desde Firebase:', error);
      console.warn('Usando lista del environment como fallback');
      return environment.authorizedEmails;
    }
  }

  /**
   * Observable en tiempo real de la lista de correos autorizados
   * Se actualiza automáticamente cuando cambia la base de datos
   * Retorna la combinación de environment + Firebase sin duplicados
   */
  getAuthorizedEmailsRealtime(): Observable<string[]> {
    return new Observable<string[]>(subscriber => {
      console.log('🔵 Iniciando listener de correos autorizados...');
      
      const callback = (snapshot: any) => {
        try {
          const data = snapshot.val();
          console.log('📊 Datos recibidos de Firebase:', data);
          
          const firebaseEmails = data ? Object.values(data).map((item: any) => item.email) : [];
          console.log('📧 Emails de Firebase:', firebaseEmails);
          console.log('📧 Emails del environment:', environment.authorizedEmails);
          
          // Combinar environment + Firebase sin duplicados
          const allEmails = new Set([...environment.authorizedEmails, ...firebaseEmails]);
          const emailsArray = Array.from(allEmails);
          
          console.log('✅ Total de emails combinados:', emailsArray.length, emailsArray);
          subscriber.next(emailsArray);
        } catch (error) {
          console.error('❌ Error procesando datos:', error);
          subscriber.next(environment.authorizedEmails);
        }
      };

      const errorCallback = (error: any) => {
        console.error('❌ Error en listener de correos autorizados:', error);
        subscriber.next(environment.authorizedEmails);
      };

      // Escuchar cambios en tiempo real
      this.authorizedEmailsRef.on('value', callback, errorCallback);

      // Cleanup cuando se desuscriba
      return () => {
        console.log('🔴 Desconectando listener de correos autorizados');
        this.authorizedEmailsRef.off('value', callback);
      };
    });
  }

  /**
   * Agrega un nuevo correo a la lista de autorizados
   */
  async addAuthorizedEmail(email: string, addedBy: string): Promise<void> {
    try {
      const sanitizedEmail = this.sanitizeEmail(email);
      await this.authorizedEmailsRef.child(sanitizedEmail).set({
        email: email,
        addedAt: Date.now(),
        addedBy: addedBy
      });
      console.log('Correo agregado exitosamente a Firebase:', email);
    } catch (error: any) {
      console.error('Error agregando correo autorizado:', error);
      
      // Mensajes de error más descriptivos
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permiso denegado. Verifica las reglas de Firebase Realtime Database');
      } else if (error.message && error.message.includes('network')) {
        throw new Error('Error de red. Verifica tu conexión a internet');
      } else if (error.message && error.message.includes('database')) {
        throw new Error('Firebase Realtime Database no está habilitado o configurado');
      }
      
      throw new Error(`Error al agregar correo: ${error.message || 'Error desconocido'}`);
    }
  }

  /**
   * Elimina un correo de la lista de autorizados
   */
  async removeAuthorizedEmail(email: string): Promise<void> {
    try {
      // No permitir eliminar administradores
      if (this.isAdmin(email)) {
        throw new Error('No se puede eliminar un administrador');
      }

      const sanitizedEmail = this.sanitizeEmail(email);
      await this.authorizedEmailsRef.child(sanitizedEmail).remove();
    } catch (error) {
      console.error('Error eliminando correo autorizado:', error);
      throw error;
    }
  }

  /**
   * Sanitiza el email para usarlo como clave en Firebase
   */
  private sanitizeEmail(email: string): string {
    return email.replace(/[.#$\[\]]/g, '_');
  }
}
