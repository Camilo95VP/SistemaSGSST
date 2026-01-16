
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-planear',
  templateUrl: './planear.component.html',
  styleUrls: ['./planear.component.css']
})
export class PlanearComponent implements OnInit {
  planear: any = null;
  subdivisionesAbiertas: boolean[] = [];
  actividadesAbiertas: { [key: number]: boolean[] } = {};

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('assets/estructura.json').subscribe(data => {
      const fase = data.fases.find((f: any) => f.id === 'PLANEAR');
      this.planear = fase;
      if (this.planear && this.planear.subdivision) {
        this.subdivisionesAbiertas = this.planear.subdivision.map(() => false);
        this.planear.subdivision.forEach((sub: any, i: number) => {
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
