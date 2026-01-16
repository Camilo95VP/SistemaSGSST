
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface RutaActividad {
  actividad: string;
  code: string;
  subdivision: string;
  fase: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  busqueda: string = '';
  sugerencias: RutaActividad[] = [];
  actividades: RutaActividad[] = [];
  modalVisible: boolean = false;
  rutaSeleccionada: RutaActividad | null = null;
  mostrarConfirmacionDescarga: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarActividades();
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
    // Construir la ruta con nombres seguros para carpetas y mantener tildes
    const clean = (str: string) => (str || '').normalize('NFC').replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, ' ').trim();
    // Duplicar % para que el .bat lo interprete como literal
    const escapeBat = (str: string) => str.replace(/%/g, '%%');
    const ruta = [
      escapeBat(clean(this.rutaSeleccionada.fase)),
      escapeBat(clean(this.rutaSeleccionada.subdivision)),
      escapeBat(clean(this.rutaSeleccionada.code)),
      escapeBat(clean(this.rutaSeleccionada.actividad))
    ].join('\\');
    // Script .bat para crear la ruta completa en Descargas (mkdir /p para subcarpetas)
    const script = `@echo off\r\nchcp 65001 >nul\r\ncd /d %USERPROFILE%\\Downloads\r\nmkdir "${ruta}"\r\n`;
    // Agregar BOM UTF-8 para Windows
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
