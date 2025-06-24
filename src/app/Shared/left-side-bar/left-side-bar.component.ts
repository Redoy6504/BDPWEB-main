import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHelperService } from '../Services/http-helper.service';
import { LayoutService } from '../Services/layout.service';
import { CommonHelper } from '../Services/CommonHelper';

@Component({
  selector: 'app-left-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './left-side-bar.component.html',
  styleUrl: './left-side-bar.component.scss',
  providers: [LayoutService, AuthService, ToastrService, HttpHelperService]
})
export class LeftSideBarComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  public currentUser: any;
  menuList: any[] = [];
  ngOnInit(): void {
    this.menuList = [];
    this.currentUser = CommonHelper.GetUser();
  }

  public getMenu(routeName: string) {
    let menuNameFind = this.menuList.find((x: any) => x.RoutingPath == routeName);
    return menuNameFind == undefined ? false : true;
  }
  public getMenuName(routeName: string): any {
    let menuNameFind = this.menuList.find((x: any) => x.RoutingPath == routeName);
    return menuNameFind == undefined ? "" : menuNameFind.Name;;
  }



}
