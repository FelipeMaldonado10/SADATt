
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { TokenService } from '../../../core/services/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;

  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit() {
    this.updateSessionState();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateSessionState();
      }
    });
  }

  updateSessionState() {
    this.isLoggedIn = this.tokenService.isLoggedIn();
    this.isAdmin = this.tokenService.getUserRole() === 'admin';
  }

  logout() {
    this.tokenService.logout();
    this.updateSessionState();
    this.router.navigate(['/']);
  }
}
