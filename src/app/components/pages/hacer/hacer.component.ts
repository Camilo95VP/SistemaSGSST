
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hacer',
  templateUrl: './hacer.component.html',
  styleUrls: ['./hacer.component.css']
})
export class HacerComponent implements OnInit {
  hacer: any = null;
  subdivisionesAbiertas: boolean[] = [];
  actividadesAbiertas: { [key: number]: boolean[] } = {};

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('assets/estructura.json').subscribe(data => {
      const fase = data.fases.find((f: any) => f.id === 'HACER');
      this.hacer = fase;
      if (this.hacer && this.hacer.subdivision) {
        this.subdivisionesAbiertas = this.hacer.subdivision.map(() => false);
        this.hacer.subdivision.forEach((sub: any, i: number) => {
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
