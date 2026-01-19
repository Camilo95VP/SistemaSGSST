import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css']
})
export class NavBarComponent implements OnInit {
  user: User | null = null;
  mostrarConfirmacionLogout: boolean = false;

  constructor(private auth: Auth) { }

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  confirmarLogout() {
    this.mostrarConfirmacionLogout = true;
  }

  async logout() {
    await this.auth.signOut();
    window.location.href = '/';
  }
}
