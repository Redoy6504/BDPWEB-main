import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';
import { ServiceDetailFilterDto, ServiceDetailRequestDto } from '../../Models/RequestDto/ServiceDetail';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Services/auth.service';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DistrictFilterDto } from '../../Models/RequestDto/District';
import { ThanaFilterDto } from '../../Models/RequestDto/Thana';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent, NgxEditorModule, FormsModule],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceDetailComponent implements OnInit {

  private servicedetailGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public districtList: any[] = [];
  public districtFromList: any[] = [];
  public thanaList: any[] = [];
  public thanaFromList: any[] = [];

  public oThanaFilterDto = new ThanaFilterDto();
  public oThanaFilterDtoFrom = new ThanaFilterDto();
  public oDistrictFilterDto = new DistrictFilterDto();

  public oServiceDetailFilterDto = new ServiceDetailFilterDto();
  public oServiceDetailRequestDto = new ServiceDetailRequestDto();

  public servicedetailId = 0;
  public editor: Editor = new Editor();
  public toolbar: Toolbar;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'Name', width: 150, headerName: 'ServiceDetail Name', filter: true },
    { field: 'PhoneNo', width: 150, headerName: 'PhoneNo', filter: true },
    { field: 'TelePhone', width: 150, headerName: 'TelePhone', filter: true },
    { field: 'Description', width: 150, headerName: 'Description', filter: true },
    { field: 'Lat', width: 150, headerName: 'Lat', filter: true },
    { field: 'Long', width: 150, headerName: 'Long', filter: true },
    { field: 'Remarks', headerName: 'Remarks' },
    { field: 'IsActive', headerName: 'Status' },
  ];

  trackByFn: TrackByFunction<any> | any;
  trackByDistrict: TrackByFunction<any> | any;
  trackByDistrictFrom: TrackByFunction<any> | any;
  trackByThana: TrackByFunction<any> | any;
  trackByThanaFrom: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private datePipe: DatePipe) {
    this.toolbar = CommonHelper.GetToolBar();
  }


  ngOnInit(): void {
    var serviceId = this.activeRouter.snapshot.paramMap.get('id');
    if (serviceId != null) {
      this.oServiceDetailFilterDto.ServiceId = Number(serviceId);
    }
    this.GetDistricts();
    this.GetServiceDetail();
  }

  onGridReadyTransection(params: any) {
    this.servicedetailGridApi = params.api;
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
    this.GetServiceDetail();
  }

  private GetServiceDetail() {
    this.oServiceDetailFilterDto.IsActive = CommonHelper.booleanConvert(this.oServiceDetailFilterDto.IsActive);
    this.oServiceDetailFilterDto.DistictId = Number(this.oServiceDetailFilterDto.DistictId);
    this.oServiceDetailFilterDto.ThanaId = Number(this.oServiceDetailFilterDto.ThanaId);
    this.oServiceDetailFilterDto.ServiceId = Number(this.oServiceDetailFilterDto.ServiceId);
    // After the hash is generated, proceed with the API call
    this.http.Post(`ServiceDetail/GetServiceDetail?pageNumber=${this.pageIndex ? this.pageIndex : 1}`, this.oServiceDetailFilterDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.Items;
        this.pageIndex = res.PageIndex;
        this.totalPages = res.TotalPages;
        this.totalRecords = res.TotalRecords;
        this.hasPreviousPage = res.HasPreviousPage;
        this.hasNextPage = res.HasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  private GetDistricts() {
    this.oDistrictFilterDto.IsActive = CommonHelper.booleanConvert(this.oDistrictFilterDto.IsActive);
    this.oDistrictFilterDto.Type = Number(this.oDistrictFilterDto.Type);
    // After the hash is generated, proceed with the API call
    this.http.Post(`DistrictThana/GetDistricts`, this.oDistrictFilterDto).subscribe(
      (res: any) => {
        this.districtList = res;
        this.districtFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  private GetThanas() {
    this.oThanaFilterDto.IsActive = CommonHelper.booleanConvert(this.oThanaFilterDto.IsActive);
    this.oThanaFilterDto.Type = Number(this.oThanaFilterDto.Type);
    this.oThanaFilterDto.DistinctId = Number(this.oThanaFilterDto.DistinctId);
    // After the hash is generated, proceed with the API call
    this.http.Post(`DistrictThana/GetThanasByDistrict`, this.oThanaFilterDto).subscribe(
      (res: any) => {
        this.thanaList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetThanasFrom() {
    this.oThanaFilterDtoFrom.IsActive = CommonHelper.booleanConvert(this.oThanaFilterDtoFrom.IsActive);
    this.oThanaFilterDtoFrom.Type = Number(this.oThanaFilterDtoFrom.Type);
    this.oThanaFilterDtoFrom.DistinctId = Number(this.oThanaFilterDtoFrom.DistinctId);
    // After the hash is generated, proceed with the API call
    this.http.Post(`DistrictThana/GetThanasByDistrict`, this.oThanaFilterDtoFrom).subscribe(
      (res: any) => {
        this.thanaFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  public districtChange(event: any) {
    this.oThanaFilterDto.DistinctId = Number(event.target.value);
    this.thanaList = [];
    this.GetThanas();
  }
  public districtChangeFrom(event: any) {
    this.oThanaFilterDtoFrom.DistinctId = Number(event.target.value);
    this.thanaFromList = [];
    this.GetThanasFrom();
  }


  public onFileChange(event: any): void {
    debugger
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.http.UploadFile(`UploadedFile/Upload`, file).subscribe(
        (res: any) => {
          debugger
          this.oServiceDetailRequestDto.FileId = Number(res.Id);
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

  }


  public InsertServiceDetail() {
    debugger
    if (this.oServiceDetailRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oServiceDetailRequestDto.ServiceId = Number(this.oServiceDetailFilterDto.ServiceId);
    this.oServiceDetailRequestDto.FileId = Number(this.oServiceDetailRequestDto.FileId);
    this.oServiceDetailRequestDto.DistictId = Number(this.oServiceDetailRequestDto.DistictId);
    this.oServiceDetailRequestDto.ThanaId = Number(this.oServiceDetailRequestDto.ThanaId);
    this.oServiceDetailRequestDto.UserID = currentUser?.UserId ? currentUser?.UserId : "";
    this.oServiceDetailRequestDto.IsActive = CommonHelper.booleanConvert(this.oServiceDetailRequestDto.IsActive);

    // After the hash is generated, proceed with the API call
    this.http.Post(`ServiceDetail/InsertServiceDetail`, this.oServiceDetailRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        } else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetServiceDetail();
          this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.message, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateServiceDetail() {

    if (this.oServiceDetailRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oServiceDetailRequestDto.ServiceId = Number(this.oServiceDetailFilterDto.ServiceId);
    this.oServiceDetailRequestDto.FileId = Number(this.oServiceDetailRequestDto.FileId);
    this.oServiceDetailRequestDto.DistictId = Number(this.oServiceDetailRequestDto.DistictId);
    this.oServiceDetailRequestDto.ThanaId = Number(this.oServiceDetailRequestDto.ThanaId);
    this.oServiceDetailRequestDto.UserID = currentUser?.UserId ? currentUser?.UserId : "";
    this.oServiceDetailRequestDto.IsActive = CommonHelper.booleanConvert(this.oServiceDetailRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`ServiceDetail/UpdateServiceDetail/${this.servicedetailId}`, this.oServiceDetailRequestDto).subscribe(
      (res: any) => {
        if (res.StatusCode != 200) {
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        }
        else {
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetServiceDetail();
          this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteServiceDetail() {
    this.oServiceDetailRequestDto.IsActive = CommonHelper.booleanConvert(this.oServiceDetailRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`ServiceDetail/DeleteServiceDetail/${this.servicedetailId}`, this.oServiceDetailRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetServiceDetail();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oServiceDetailRequestDto = new ServiceDetailRequestDto();
    this.servicedetailId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.servicedetailGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.servicedetailId = Number(getSelectedItem.Id);
    this.oServiceDetailRequestDto.Name = getSelectedItem.Name;
    this.oServiceDetailRequestDto.ServiceId = Number(getSelectedItem.ServiceId);
    this.oServiceDetailRequestDto.FileId = Number(getSelectedItem.FileId);
    this.oServiceDetailRequestDto.DistictId = Number(getSelectedItem.DistictId);
    this.oServiceDetailRequestDto.ThanaId = Number(getSelectedItem.ThanaId);
    this.oServiceDetailRequestDto.PhoneNo = getSelectedItem.PhoneNo;
    this.oServiceDetailRequestDto.TelePhone = getSelectedItem.TelePhone;
    this.oServiceDetailRequestDto.Description = getSelectedItem.Description;
    this.oServiceDetailRequestDto.Lat = getSelectedItem.Lat;
    this.oServiceDetailRequestDto.Long = getSelectedItem.Long;
    this.oServiceDetailRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oServiceDetailRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.servicedetailGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }

    this.servicedetailId = Number(getSelectedItem.Id);
    this.oServiceDetailRequestDto.Name = getSelectedItem.Name;
    this.oServiceDetailRequestDto.ServiceId = Number(getSelectedItem.ServiceId);
    this.oServiceDetailRequestDto.FileId = Number(getSelectedItem.FileId);
    this.oServiceDetailRequestDto.DistictId = Number(getSelectedItem.DistictId);
    this.oServiceDetailRequestDto.ThanaId = Number(getSelectedItem.ThanaId);
    this.oServiceDetailRequestDto.PhoneNo = getSelectedItem.PhoneNo;
    this.oServiceDetailRequestDto.TelePhone = getSelectedItem.TelePhone;
    this.oServiceDetailRequestDto.Description = getSelectedItem.Description;
    this.oServiceDetailRequestDto.Lat = getSelectedItem.Lat;
    this.oServiceDetailRequestDto.Long = getSelectedItem.Long;
    this.oServiceDetailRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.IsActive);
    this.oServiceDetailRequestDto.Remarks = getSelectedItem.Remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetServiceDetail();
  }



}
