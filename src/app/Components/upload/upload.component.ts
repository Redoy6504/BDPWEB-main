import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Services/auth.service';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { FileResponseDto } from '../../Models/RequestDto/FileResponseDto';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {


  public oFileResponseDto = new FileResponseDto();
  constructor(public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService) {

  }

  public onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.http.UploadFile(`UploadedFile/Upload`, file).subscribe(
        (res: any) => {
          this.oFileResponseDto = res;
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

  }


}
