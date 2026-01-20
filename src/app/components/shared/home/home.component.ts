import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
// CAMBIO: Importamos la versión compat
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface RutaActividad {
  actividad: string;
  code: string;
  subdivision: string;
  fase: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './home2.component.css']
})
export class HomeComponent implements OnInit {
  busqueda: string = '';
  sugerencias: RutaActividad[] = [];
  actividades: RutaActividad[] = [];
  modalVisible: boolean = false;
  rutaSeleccionada: RutaActividad | null = null;
  mostrarConfirmacionDescarga: boolean = false;
  user: any = null; 
  showWelcome: boolean = false;
  welcomeMsg: string = '';
  mostrarConfirmacionLogout: boolean = false;

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) { }

  confirmarLogout() {
    this.mostrarConfirmacionLogout = true;
  }

  async logout() {
    await this.afAuth.signOut();
    window.location.href = '/';
  }

  ngOnInit() {
    this.cargarActividades();
  
    this.afAuth.authState.subscribe((user) => {
      this.user = user;
      if (user && user.email && environment.authorizedEmails.includes(user.email)) {
        this.showWelcome = true;
        this.welcomeMsg = `¡Bienvenido, ${user.displayName || user.email}!`;
      } else {
        this.showWelcome = false;
        this.welcomeMsg = '';
      }
    });
  }

  cargarActividades() {
    this.http.get<any>('assets/estructura.json').subscribe(data => {
      const actividades: RutaActividad[] = [];
      for (const fase of data.fases) {
        for (const subdiv of fase.subdivision) {
          for (const act of subdiv.actividades) {
            for (const evidencia of act.evidencias) {
              actividades.push({
                actividad: evidencia.nombre,
                code: act.code,
                subdivision: subdiv.nombre,
                fase: fase.id
              });
            }
          }
        }
      }
      this.actividades = actividades;
    });
  }

  buscarActividad() {
    const texto = this.busqueda.trim().toLowerCase();
    if (!texto) {
      this.sugerencias = [];
      return;
    }
    this.sugerencias = this.actividades.filter(a => a.actividad.toLowerCase().includes(texto)).slice(0, 10);
  }

  seleccionarActividad(sugerencia: RutaActividad) {
    this.rutaSeleccionada = sugerencia;
    this.modalVisible = true;
    this.sugerencias = [];
    this.busqueda = sugerencia.actividad;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.rutaSeleccionada = null;
  }

  descargarScriptCrearRuta() {
    if (!this.rutaSeleccionada) { return; }
    const clean = (str: string) => (str || '').normalize('NFC').replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, ' ').trim();
    const escapeBat = (str: string) => str.replace(/%/g, '%%');
    const ruta = [
      escapeBat(clean(this.rutaSeleccionada.fase)),
      escapeBat(clean(this.rutaSeleccionada.subdivision)),
      escapeBat(clean(this.rutaSeleccionada.code)),
      escapeBat(clean(this.rutaSeleccionada.actividad))
    ].join('\\');
    const script = `@echo off\r\nchcp 65001 >nul\r\ncd /d %USERPROFILE%\\Downloads\r\nmkdir "${ruta}"\r\n`;
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, script], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crear_ruta.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}