import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { LayoutService } from '../Services/layout.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHelperService } from '../Services/http-helper.service';
import { FormsModule } from '@angular/forms';
import { LoginRequestDto } from '../../Models/RequestDto/loginRequestDto';
import { Router } from '@angular/router';
import { cwd } from 'node:process';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [LayoutService, AuthService, ToastrService, HttpHelperService]
})
export class LoginComponent implements OnInit, AfterViewChecked {

  public bodyHeight = 800;

  public oLoginRequestDto = new LoginRequestDto();
  constructor(private layout: LayoutService,
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private route: Router
  ) {
  }

  ngAfterViewChecked(): void {
    this.bodyHeight = this.layout.getLayoutBodyHeight('', '') - 2;
  }

  ngOnInit(): void {

    this.bodyHeight = this.layout.getLayoutBodyHeight('', '') - 2;

    if (this.authService.isLogin()) {
      this.route.navigateByUrl("/dashboard");
    }

  }



  public async Login() {

    if (this.oLoginRequestDto.UserName == "") {
    this.toast.warning("Enter your user name!!", "Warning!!", { progressBar: true });
    return;
  }

  if (this.oLoginRequestDto.Password == "") {
    this.toast.warning("Enter your password!!", "Warning!!", { progressBar: true });
    return;
  }

     const payload = {
      userName: this.oLoginRequestDto.UserName,
      password: this.oLoginRequestDto.Password,
    }
    this.http.Login("Auth/GetToken", payload).subscribe(
      (res: any) => {
        debugger
        if (res) {
          this.toast.success("Login Successfully!!", "Success!!", { progressBar: true });
          localStorage.setItem("Token", res.JwtToken)
          localStorage.setItem("RefreshToken", res.RefreshToken)
          localStorage.setItem("UserResponseDto", JSON.stringify(res))
          this.route.navigateByUrl("/dashboard");
        } else {
                debugger
          this.toast.error(res.message, "Error!!", { progressBar: true });
        }

      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      });

  }




}

