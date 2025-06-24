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
import { MenuFilterRequestDto, MenuRequestDto } from '../../Models/RequestDto/Menu';
import { MenuPerRequestDto } from '../../Models/RequestDto/MenuPermission';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  providers: [DatePipe]
})
export class MenuComponent implements OnInit {



  private MenuGridApi!: any;
  private MenuPermissionGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public rowDataMenuPermission!: any[];
  public oMenuFilterRequestDto = new MenuFilterRequestDto();
  public oMenuRequestDto = new MenuRequestDto();

  public MenuId = 0;

  userList: any[] = [];
  CompanyList: any[] = [];

  trackByCompany: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;

  public oMenuPerRequestDto = new MenuPerRequestDto();
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headername: 'SL', width: 90, editable: false, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'name', width: 150, headername: 'Menu name', filter: true },
    { field: 'shortName', width: 150, headername: 'Short name', filter: true },
    { field: 'routingPath', width: 150, headername: 'RoutingPath', filter: true },
    { field: 'isActive', headername: 'Status' },
    { field: 'remarks', headername: 'Remarks' },
  ];
  public colDefsMenuPermission: any[] = [
    { valueGetter: "node.rowIndex + 1", headername: 'SL', width: 90, editable: false, checkboxSelection: false, headerCheckboxSelection: false },
    { field: 'name', width: 150, headername: 'Menu name', filter: true, editable: true },
  ];
  trackByFn: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
  }
  ngOnInit(): void {
    this.GetMenu();
  }

  onGridReadyTransection(params: any) {
    this.MenuGridApi = params.api;
    this.rowData = [];
  }

  onGridReadyMenuPermission(params: any) {
    this.MenuPermissionGridApi = params.api;
    this.rowDataMenuPermission = [];
  }

  public companyChange() {
    this.GetAllUsers();
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
  private GetAllUsers() {
    this.userList = [];
    this.http.Get(`AspNetUsers/GetAllUsers/` + Number(this.oMenuPerRequestDto.companyId)).subscribe(
      (res: any) => {
        this.userList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

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
    this.GetMenu();
  }
  private GetMenu() {

    let currentUser = CommonHelper.GetUser();
    this.oMenuFilterRequestDto.name = (this.oMenuFilterRequestDto.name);
    this.oMenuFilterRequestDto.shortName = (this.oMenuFilterRequestDto.shortName);
    this.oMenuFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oMenuFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Menu/GetMenues?pageNumber=${this.pageIndex}`, this.oMenuFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.MenuGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public InsertMenu() {

    if (this.oMenuRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oMenuRequestDto.shortName = (this.oMenuRequestDto.shortName);
    this.oMenuRequestDto.routingPath = (this.oMenuRequestDto.routingPath);
    this.oMenuRequestDto.isActive = CommonHelper.booleanConvert(this.oMenuRequestDto.isActive);
    this.oMenuRequestDto.remarks = (this.oMenuRequestDto.remarks);

    // After the hash is generated, proceed with the API call
    this.http.Post(`Menu/InsertMenu`, this.oMenuRequestDto).subscribe(
      (res: any) => {
        if(res.statusCode!=200){
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        }
        else{
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetMenu();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }
  public UpdateMenu() {

    if (this.oMenuRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oMenuRequestDto.shortName = (this.oMenuRequestDto.shortName);
    this.oMenuRequestDto.routingPath = (this.oMenuRequestDto.routingPath);
    this.oMenuRequestDto.isActive = CommonHelper.booleanConvert(this.oMenuRequestDto.isActive);
    this.oMenuRequestDto.remarks = (this.oMenuRequestDto.remarks);

    // After the hash is generated, proceed with the API call
    this.http.Post(`Menu/UpdateMenu/${this.MenuId}`, this.oMenuRequestDto).subscribe(
      (res: any) => {
        
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetMenu();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteMenu() {
    this.oMenuRequestDto.isActive = CommonHelper.booleanConvert(this.oMenuRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Menu/DeleteMenu/${this.MenuId}`, this.oMenuRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetMenu();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oMenuRequestDto = new MenuRequestDto();
    this.MenuId = 0;
  }

  menuPermission() {
    this.GetAllCompanies();
    CommonHelper.CommonButtonClick("openPerCommonModel");
    this.oMenuPerRequestDto = new MenuPerRequestDto();
    this.rowDataMenuPermission = [];
    let getSelectedRow = AGGridHelper.GetSelectedRows(this.MenuGridApi);
    getSelectedRow.forEach(element => {
      this.rowDataMenuPermission.push({ id: element.id, name: element.name });
    });

  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.MenuGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.MenuId = Number(getSelectedItem.id);
    this.oMenuRequestDto.name = getSelectedItem.name;
    this.oMenuRequestDto.shortName = getSelectedItem.shortName;
    this.oMenuRequestDto.routingPath = getSelectedItem.routingPath;
    this.oMenuRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oMenuRequestDto.remarks = getSelectedItem.remarks;

    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.MenuGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.MenuId = Number(getSelectedItem.id);
    this.oMenuRequestDto.name = getSelectedItem.name;
    this.oMenuRequestDto.isActive = getSelectedItem.isActive;
    this.oMenuRequestDto.remarks = getSelectedItem.remarks;

    CommonHelper.CommonButtonClick("openCommonDelete");

  }



  public InsertMenuPermission() {

    if (this.oMenuPerRequestDto.userID == "") {
      this.toast.warning("Please select user", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oMenuPerRequestDto.companyId == 0) {
      this.toast.warning("Please select company", "Warning!!", { progressBar: true });
      return;
    }

    this.oMenuPerRequestDto.menues = AGGridHelper.GetRows(this.MenuPermissionGridApi);
    this.oMenuPerRequestDto.userID = (this.oMenuPerRequestDto.userID);
    this.oMenuPerRequestDto.companyId = Number(this.oMenuPerRequestDto.companyId);
    this.oMenuPerRequestDto.isActive = CommonHelper.booleanConvert(this.oMenuPerRequestDto.isActive);
    this.oMenuPerRequestDto.remarks = (this.oMenuPerRequestDto.remarks);

    // After the hash is generated, proceed with the API call
    this.http.Post(`MenuPermission/InsertMenuPermission`, this.oMenuPerRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closePerCommonModel");
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  public onPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageIndex = pageNumber;
      this.GetMenu();
    }
  }
  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetMenu();
    }
  }
  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetMenu();
    }
  }


}
