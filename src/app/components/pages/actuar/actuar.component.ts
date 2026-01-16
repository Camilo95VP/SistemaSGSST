
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-actuar',
  templateUrl: './actuar.component.html',
  styleUrls: ['./actuar.component.css']
})
export class ActuarComponent implements OnInit {
  actuar: any = null;
  subdivisionesAbiertas: boolean[] = [];
  actividadesAbiertas: { [key: number]: boolean[] } = {};

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('assets/estructura.json').subscribe(data => {
      const fase = data.fases.find((f: any) => f.id === 'ACTUAR');
      this.actuar = fase;
      if (this.actuar && this.actuar.subdivision) {
        this.subdivisionesAbiertas = this.actuar.subdivision.map(() => false);
        this.actuar.subdivision.forEach((sub: any, i: number) => {
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
