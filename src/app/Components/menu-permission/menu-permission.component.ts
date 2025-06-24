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
import { MenuPermissionFilterRequestDto, MenuPermissionRequestDto } from '../../Models/RequestDto/MenuPermission';

@Component({
  selector: 'app-menu-permission',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './menu-permission.component.html',
  styleUrl: './menu-permission.component.scss',
  providers: [DatePipe]
})
export class MenuPermissionComponent implements OnInit {

  private MenuPermissionGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oMenuPermissionFilterRequestDto = new MenuPermissionFilterRequestDto();
  public oMenuPermissionRequestDto = new MenuPermissionRequestDto();
  userList: any[] = [];
  manuList: any[] = [];
  CompanyList: any[] = [];
  public MenuPermissionId = 0;

  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headername: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'userName', width: 150, headername: 'User Name', filter: true },
    { field: 'menuName', width: 150, headername: 'Menu Name', filter: true },
    { field: 'companyName', width: 150, headername: 'Company Name', filter: true },
    { field: 'name', headername: 'Name', filter: true },
    { field: 'isActive', headername: 'IsActive', filter: true },
    { field: 'remarks', headername: 'Remarks', filter: true },
  ];
  trackByCompany: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;
  trackByMenu: TrackByFunction<any> | any;
  trackByFn: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
  }
  ngOnInit(): void {
    this.GetMenuPermission();
    this.GetAllMenues();
    this.GetAllCompanies();
    this.GetAllUsers();
  }

  onGridReadyTransection(params: any) {
    this.MenuPermissionGridApi = params.api;
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
    this.GetMenuPermission();
  }

  public companyChange() {
    this.GetAllUsers();
  }
  public onFiltercompanyChange() {
    this.GetAllfilterUser();
  }
 public userchange() {
    this.GetAllUsers();
  }

  private GetAllUsers() {
    this.userList = [];
    this.http.Get(`AspNetUsers/GetAllUsers/` + Number(this.oMenuPermissionRequestDto.companyId)).subscribe(
      (res: any) => {
        this.userList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  private GetAllfilterUser() {
    this.userList = [];
    this.http.Get(`AspNetUsers/GetAllUsers/` + Number(this.oMenuPermissionFilterRequestDto.companyId)).subscribe(
      (res: any) => {
        this.userList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

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
  private GetAllMenues() {

    this.http.Get(`Menu/GetAllMenues`).subscribe(
      (res: any) => {
        this.manuList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetMenuPermission() {

    let currentUser = CommonHelper.GetUser();
    this.oMenuPermissionFilterRequestDto.companyId = Number(this.oMenuPermissionFilterRequestDto.companyId);
    this.oMenuPermissionFilterRequestDto.userID =(this.oMenuPermissionFilterRequestDto.userID);
    this.oMenuPermissionFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oMenuPermissionFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`MenuPermission/GetMenuPermissiones?pageNumber=${this.pageIndex}`, this.oMenuPermissionFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.MenuPermissionGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public InsertMenuPermission() {
 
    if (this.oMenuPermissionRequestDto.userID == "") {
      this.toast.warning("Please select user", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oMenuPermissionRequestDto.menuId == 0) {
      this.toast.warning("Please select Manu", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oMenuPermissionRequestDto.name == "") {
      this.toast.warning("Please enter Name", "Warning!!", { progressBar: true });
      return;
    }
    this.oMenuPermissionRequestDto.userID = (this.oMenuPermissionRequestDto.userID);
    this.oMenuPermissionRequestDto.menuId = Number(this.oMenuPermissionRequestDto.menuId);
    this.oMenuPermissionRequestDto.companyId = Number(this.oMenuPermissionRequestDto.companyId);
    this.oMenuPermissionRequestDto.name = (this.oMenuPermissionRequestDto.name);
    this.oMenuPermissionRequestDto.isActive = CommonHelper.booleanConvert(this.oMenuPermissionRequestDto.isActive);
    this.oMenuPermissionRequestDto.remarks = (this.oMenuPermissionRequestDto.remarks);

    // After the hash is generated, proceed with the API call
    this.http.Post(`MenuPermission/InsertMenuPermission`, this.oMenuPermissionRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.defaultDataGet();
        // this.GetMenuPermission();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }
  public UpdateMenuPermission() {

    // if (this.oMenuPermissionRequestDto.name == "") {
    //   this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
    //   return;
    // }
    if (this.oMenuPermissionRequestDto.menuId == 0) {
      this.toast.warning("Please select Manu", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oMenuPermissionRequestDto.name == "") {
      this.toast.warning("Please enter Name", "Warning!!", { progressBar: true });
      return;
    }
    this.oMenuPermissionRequestDto.userID = (this.oMenuPermissionRequestDto.userID);
    this.oMenuPermissionRequestDto.menuId = Number(this.oMenuPermissionRequestDto.menuId);
    this.oMenuPermissionRequestDto.companyId = Number(this.oMenuPermissionRequestDto.companyId);
    this.oMenuPermissionRequestDto.name = (this.oMenuPermissionRequestDto.name);
    this.oMenuPermissionRequestDto.isActive = CommonHelper.booleanConvert(this.oMenuPermissionRequestDto.isActive);
    this.oMenuPermissionRequestDto.remarks = (this.oMenuPermissionRequestDto.remarks);
    // After the hash is generated, proceed with the API call
    this.http.Post(`MenuPermission/UpdateMenuPermission/${this.MenuPermissionId}`, this.oMenuPermissionRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.defaultDataGet();
        this.GetMenuPermission();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  defaultDataGet() {
    this.oMenuPermissionFilterRequestDto.companyId = Number(this.oMenuPermissionRequestDto.companyId);
    this.oMenuPermissionFilterRequestDto.userID = this.oMenuPermissionRequestDto.userID;
   
  }
  public DeleteMenuPermission() {
    let currentUser = CommonHelper.GetUser();

    this.oMenuPermissionRequestDto.isActive = CommonHelper.booleanConvert(this.oMenuPermissionRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`MenuPermission/DeleteMenuPermission/${this.MenuPermissionId}`, this.oMenuPermissionRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetMenuPermission();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oMenuPermissionRequestDto = new MenuPermissionRequestDto();
    this.MenuPermissionId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.MenuPermissionGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oMenuPermissionRequestDto = getSelectedItem;
    this.MenuPermissionId = Number(getSelectedItem.id);

  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.MenuPermissionGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.MenuPermissionId = Number(getSelectedItem.id);
    this.oMenuPermissionRequestDto.isActive = CommonHelper.booleanConvert(this.oMenuPermissionRequestDto.isActive);
    this.oMenuPermissionRequestDto.remarks = (this.oMenuPermissionRequestDto.remarks);

    CommonHelper.CommonButtonClick("openCommonDelete");

  }

  public onPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageIndex = pageNumber;
      this.GetMenuPermission();
    }
  }
  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetMenuPermission();
    }
  }
  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetMenuPermission();
    }
  }

}
