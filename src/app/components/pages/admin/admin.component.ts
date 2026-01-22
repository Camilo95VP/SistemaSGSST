import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  authorizedEmails: string[] = [];
  newEmail: string = '';
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  loading: boolean = true;
  currentUserEmail: string = '';
  isAdmin: boolean = false;

  showConfirmModal: boolean = false;
  emailToDelete: string | null = null;

  constructor(
    private adminService: AdminService,
    private afAuth: AngularFireAuth
  ) {}

  async ngOnInit() {
    // Verificar que el usuario actual es admin
    const user = await this.afAuth.currentUser;
    this.currentUserEmail = user?.email || '';
    this.isAdmin = this.adminService.isAdmin(this.currentUserEmail);

    if (!this.isAdmin) {
      this.message = 'No tienes permisos de administrador';
      this.messageType = 'error';
      this.loading = false;
      return;
    }

    // Suscribirse a cambios en tiempo real (environment + Firebase)
    this.adminService.getAuthorizedEmailsRealtime().subscribe(
      emails => {
        console.log('✅ Correos recibidos del servicio:', emails);
        // Mostrar todos los correos: environment + Firebase
        this.authorizedEmails = emails.sort();
        this.loading = false;
        console.log('📧 Total de correos en pantalla:', this.authorizedEmails.length);
      },
      error => {
        console.error('❌ Error en suscripción a correos:', error);
        this.showMessage('Error al cargar correos autorizados', 'error');
        this.loading = false;
      }
    );
  }

  // Ya no es necesario este método, la lista se actualiza en tiempo real

  async addEmail() {
    if (!this.newEmail || !this.isValidEmail(this.newEmail)) {
      this.showMessage('Por favor ingresa un correo válido', 'error');
      return;
    }

    // Validar contra la lista dinámica
    if (this.authorizedEmails.includes(this.newEmail)) {
      this.showMessage('Este correo ya está autorizado', 'error');
      return;
    }

    this.loading = true;
    try {
      await this.adminService.addAuthorizedEmail(this.newEmail, this.currentUserEmail);
      this.showMessage('Correo agregado exitosamente', 'success');
      this.newEmail = '';
      // La lista se actualiza automáticamente en tiempo real
    } catch (error) {
      this.showMessage('Error al agregar el correo', 'error');
    }
    this.loading = false;
  }

  openConfirmModal(email: string) {
    this.emailToDelete = email;
    this.showConfirmModal = true;
  }

  async confirmRemoveEmail() {
    if (!this.emailToDelete) return;
    this.loading = true;
    try {
      await this.adminService.removeAuthorizedEmail(this.emailToDelete);
      this.showMessage('Correo eliminado exitosamente', 'success');
    } catch (error: any) {
      this.showMessage(error.message || 'Error al eliminar el correo', 'error');
    }
    this.loading = false;
    this.showConfirmModal = false;
    this.emailToDelete = null;
  }

  cancelRemoveEmail() {
    this.showConfirmModal = false;
    this.emailToDelete = null;
  }

  isAdminEmail(email: string): boolean {
    // Solo marcar como admin si el correo está en la lista dinámica Y en la lista de admins
    return this.authorizedEmails.includes(email) && this.adminService.isAdmin(email);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
