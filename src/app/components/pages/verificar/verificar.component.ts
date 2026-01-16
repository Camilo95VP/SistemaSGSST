
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verificar',
  templateUrl: './verificar.component.html',
  styleUrls: ['./verificar.component.css']
})
export class VerificarComponent implements OnInit {
  verificar: any = null;
  subdivisionesAbiertas: boolean[] = [];
  actividadesAbiertas: { [key: number]: boolean[] } = {};

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('assets/estructura.json').subscribe(data => {
      const fase = data.fases.find((f: any) => f.id === 'VERIFICAR');
      this.verificar = fase;
      if (this.verificar && this.verificar.subdivision) {
        this.subdivisionesAbiertas = this.verificar.subdivision.map(() => false);
        this.verificar.subdivision.forEach((sub: any, i: number) => {
          this.actividadesAbiertas[i] = sub.actividades.map(() => false);
        });
      }
    });
  }

  toggleSubdivision(idx: number) {
    this.subdivisionesAbiertas[idx] = !this.subdivisionesAbiertas[idx];
  }

  toggleActividad(subIdx: number, actIdx: number) {
    this.actividadesAbiertas[subIdx][actIdx] = !this.actividadesAbiertas[subIdx][actIdx];
  }
}
