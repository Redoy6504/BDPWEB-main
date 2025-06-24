import { AfterViewChecked, Component, DoCheck, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./Shared/header/header.component";
import { LeftSideBarComponent } from "./Shared/left-side-bar/left-side-bar.component";
import { AuthService } from './Shared/Services/auth.service';
import { LayoutService } from './Shared/Services/layout.service';
import { FooterComponent } from './Shared/footer/footer.component';
// Angular Chart Component
import { AgCharts } from 'ag-charts-angular';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonHelper } from './Shared/Services/CommonHelper';
import { HttpHelperService } from './Shared/Services/http-helper.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,HeaderComponent, LeftSideBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[LayoutService, AuthService,HttpHelperService,CommonHelper]
})
export class AppComponent implements OnInit, AfterViewChecked,DoCheck{

  public bodyHeight = 400;
  public leftSideHeight = 400;
  title = 'MerchantUser';

  constructor(private layout: LayoutService, public authService: AuthService) {
  }
  ngDoCheck(): void {
    this.bodyHeight = this.layout.getLayoutBodyHeight('navbarHeaderId', 'footerId');
    this.leftSideHeight = this.layout.getLayoutBodyHeight('', '');
  }

  ngAfterViewChecked(): void {
    this.bodyHeight = this.layout.getLayoutBodyHeight('navbarHeaderId', 'footerId');
    this.leftSideHeight = this.layout.getLayoutBodyHeight('', '');
  }

  ngOnInit(): void {
    this.bodyHeight = this.layout.getLayoutBodyHeight('navbarHeaderId', 'footerId');
    this.leftSideHeight = this.layout.getLayoutBodyHeight('', '');
    console.log(this.bodyHeight)
    console.log(this.leftSideHeight)
  }

}

