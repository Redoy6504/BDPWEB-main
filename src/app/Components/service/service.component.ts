import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { Router } from '@angular/router';
import { ServiceFilterDto, ServiceRequestDto } from '../../Models/RequestDto/Service';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
  providers: [DatePipe]
})
export class ServiceComponent implements OnInit {

  private serviceGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oServiceFilterDto = new ServiceFilterDto();
  public oServiceRequestDto = new ServiceRequestDto();

  public serviceId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'Name', width: 150, headerName: 'Service Name', filter: true },
    { field: 'Icon', width: 150, headerName: 'Icon', filter: true },
    { field: 'Description', width: 150, headerName: 'Description', filter: true },
    { field: 'Remarks', headerName: 'Remarks' },
    { field: 'IsActive', headerName: 'Status' },
    { field: 'Details', headerName: 'Details', width: 100, pinned: "right", resizable: true, cellRenderer: this.detailToGrid.bind(this) },
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
    this.GetService();
  }

  onGridReadyTransection(params: any) {
    this.serviceGridApi = params.api;
    this.rowData = [];
  }

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('services/' + params.data.Id)
    });
    return eDiv;
  }

  Filter() {
    this.GetService();
  }

  private GetService() {
    let currentUser = CommonHelper.GetUser();
    this.oServiceFilterDto.IsActive = CommonHelper.booleanConvert(this.oServiceFilterDto.IsActive);
    this.oServiceFilterDto.Type = Number(this.oServiceFilterDto.Type);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Service/GetAllServices`, this.oServiceFilterDto).subscribe(
      (res: any) => {
        this.rowData = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public InsertService() {

    if (this.oServiceRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oServiceRequestDto.IsActive = CommonHelper.booleanConvert(this.oServiceRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Service/InsertService`, this.oServiceRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        } else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetService();
          this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        }

      },
      (err) => {
        this.toast.error(err.message, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateService() {

    if (this.oServiceRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oServiceRequestDto.IsActive = CommonHelper.booleanConvert(this.oServiceRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Service/UpdateService/${this.serviceId}`, this.oServiceRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        }
        else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetService();
          this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteService() {
    this.oServiceRequestDto.IsActive = CommonHelper.booleanConvert(this.oServiceRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Service/DeleteService/${this.serviceId}`, this.oServiceRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetService();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oServiceRequestDto = new ServiceRequestDto();
    this.serviceId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.serviceGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.serviceId = Number(getSelectedItem.Id);
    this.oServiceRequestDto.Icon = getSelectedItem.Icon;
    this.oServiceRequestDto.Name = getSelectedItem.Name;
    this.oServiceRequestDto.Type = Number(getSelectedItem.Type);
    this.oServiceRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oServiceRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.serviceGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.serviceId = Number(getSelectedItem.Id);
    this.oServiceRequestDto.Icon = getSelectedItem.Icon;
    this.oServiceRequestDto.Name = getSelectedItem.Name;
    this.oServiceRequestDto.Type = Number(getSelectedItem.Type);
    this.oServiceRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oServiceRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetService();
  }



}
