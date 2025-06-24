import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [AuthService]
})
export class HeaderComponent {
  constructor(private route: Router, public authService: AuthService) {

  }

  logOut() {
    localStorage.clear();
    this.route.navigate(["/"]);
  }

}
