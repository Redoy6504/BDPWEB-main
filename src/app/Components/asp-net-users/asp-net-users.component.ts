import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { Router } from '@angular/router';
import { AspNetUsersFilterRequestDto, AspNetUsersRequestDto } from '../../Models/RequestDto/AspNetUsers';
import { PaginationComponent } from "../../Shared/pagination/pagination.component";

@Component({
  selector: 'app-asp-net-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './asp-net-users.component.html',
  styleUrl: './asp-net-users.component.scss',
  providers: [DatePipe]
})
export class AspNetUsersComponent implements OnInit {

  private aspnetusersGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oAspNetUsersFilterRequestDto = new AspNetUsersFilterRequestDto();
  public oAspNetUsersRequestDto = new AspNetUsersRequestDto();
  CompanyList: any[] = [];
  roleList: any[] = [];
  public aspnetusersId = "";
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'fullName', width: 150, headerName: 'Full Name', filter: true },
    { field: 'userName', headerName: 'User Name' },
    { field: 'email', headerName: 'Email Address' },
    { field: 'phoneNumber', headerName: 'Phone Number' },
    { field: 'emailConfirmed', headerName: 'Status' },
  ];
  trackByCompany: TrackByFunction<any> | any;
  trackByFn: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
  }


  ngOnInit(): void {
    this.Roles();
    this.GetAspNetUsers();
    this.GetAllCompanies();
  }
  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetAspNetUsers();
  }

  onGridReadyTransection(params: any) {
    this.aspnetusersGridApi = params.api;
    this.rowData = [];
  }

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('transactions/' + params.data.transactionId)
    });
    return eDiv;
  }

  Filter() {
    this.GetAspNetUsers();


  }
  private GetAllCompanies() {

    this.http.Get(`Company/GetAllCompanies`).subscribe(
      (res: any) => {
        this.CompanyList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  private Roles() {

    this.http.Get(`AspNetUsers/Roles`).subscribe(
      (res: any) => {
        this.roleList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetAspNetUsers() {

    this.oAspNetUsersFilterRequestDto.companyId = Number(this.oAspNetUsersFilterRequestDto.companyId);
    this.oAspNetUsersFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oAspNetUsersFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`AspNetUsers/GetAspNetUsers?pageNumber=${this.pageIndex}`, this.oAspNetUsersFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.aspnetusersGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public InsertAspNetUsers() {

    if (this.oAspNetUsersRequestDto.fullName == "") {
      this.toast.warning("Please enter fullName", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.email == "") {
      this.toast.warning("Please enter email", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.phoneNumber == "") {
      this.toast.warning("Please enter phone number", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.password == "") {
      this.toast.warning("Please enter password", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.confirmPassword == "") {
      this.toast.warning("Please enter confirm password", "Warning!!", { progressBar: true });
      return;
    }

    let currentUser = CommonHelper.GetUser();
    this.oAspNetUsersRequestDto.companyId = Number(0);
    // After the hash is generated, proceed with the API call
    this.http.Post(`AspNetUsers/InsertAspNetUsers`, this.oAspNetUsersRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetAspNetUsers();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateAspNetUsers() {

    if (this.oAspNetUsersRequestDto.fullName == "") {
      this.toast.warning("Please enter fullName", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.email == "") {
      this.toast.warning("Please enter email", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.phoneNumber == "") {
      this.toast.warning("Please enter phone number", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.password == "") {
      this.toast.warning("Please enter password", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oAspNetUsersRequestDto.confirmPassword == "") {
      this.toast.warning("Please enter confirm password", "Warning!!", { progressBar: true });
      return;
    }

    // After the hash is generated, proceed with the API call
    this.http.Post(`AspNetUsers/UpdateAspNetUsers/${this.aspnetusersId}`, this.oAspNetUsersRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetAspNetUsers();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteAspNetUsers() {
    // After the hash is generated, proceed with the API call
    this.http.Post(`AspNetUsers/DeleteAspNetUsers/${this.aspnetusersId}`, this.oAspNetUsersRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetAspNetUsers();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oAspNetUsersRequestDto = new AspNetUsersRequestDto();
    this.aspnetusersId = "";
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.aspnetusersGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.aspnetusersId = getSelectedItem.id;
    this.oAspNetUsersRequestDto = getSelectedItem;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.aspnetusersGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.aspnetusersId = getSelectedItem.id;
    this.oAspNetUsersRequestDto = getSelectedItem;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetAspNetUsers();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetAspNetUsers();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetAspNetUsers();
    }
  }


}

