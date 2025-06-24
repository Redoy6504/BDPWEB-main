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
import { ActivatedRoute, Router } from '@angular/router';
import { ThanaFilterDto } from '../../Models/RequestDto/Thana';
import { DistrictFilterDto } from '../../Models/RequestDto/District';
import { TouristTripFilterDto, TouristTripRequestDto } from '../../Models/RequestDto/TouristTrip';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { ValueFormatterParams } from 'ag-grid-community';
@Component({
  selector: 'app-tourist-trip',
  standalone: true,
 imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent,NgxEditorModule],
  templateUrl: './tourist-trip.component.html',
  styleUrl: './tourist-trip.component.scss',
  providers:[DatePipe]
})
export class TouristTripComponent {

  private TouristTripGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public districtList: any[] = [];
  public districtFromList: any[] = [];
  public thanaList: any[] = [];
  public thanaFromList: any[] = [];

  public oThanaFilterDto = new ThanaFilterDto();
  public oThanaFilterDtoFrom = new ThanaFilterDto();
  public oDistrictFilterDto = new DistrictFilterDto();

  public oTouristTripFilterDto = new TouristTripFilterDto();
  public oTouristTripRequestDto = new TouristTripRequestDto();

  public TouristTripId = 0;
  public editor: Editor = new Editor();
  public toolbar: Toolbar;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public fromDate: any;
  public toDate: any;

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
   { field: 'FullName', headerName: 'User Name', width: 150 },
  { field: 'TouristPlace', headerName: 'Tourist Place', width: 150 },
  {
    field: 'StartDate', 
    width: 150, 
    headerName: 'Date', 
    filter: true,
    valueFormatter: this.dateFormatter.bind(this) // Proper binding
  },
  { field: 'NoOfTourist', headerName: 'Number of Tourist', width: 120 },
  // { field: 'ServiceDetailId', headerName: 'Service Detail ID', width: 140 },
  { field: 'Remarks', headerName: 'Remarks', width: 150 },
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
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

dateFormatter(params: ValueFormatterParams): string {
  if (!params.value) return ''; // Handle null/undefined
  
  try {
    // Convert to Date if it's a string
    const dateValue = typeof params.value === 'string' 
      ? new Date(params.value) 
      : params.value;
    
    // Check if valid date
    if (isNaN(dateValue.getTime())) return String(params.value); // Fallback
    
    // Format using DatePipe
    return this.datePipe.transform(dateValue, 'MMM d, y, h:mm:ss a') || '';
  } catch {
    return String(params.value); // Fallback if any error occurs
  }
}

 

  onGridReadyTransection(params: any) {
    this.TouristTripGridApi = params.api;
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
    this.pageIndex = 1;
    this.GetTouristTrip();
    
  }
 ngOnInit(): void {
    this.GetDistricts();
    this.GetTouristTrip();
  }
  private GetTouristTrip() {
     let currentUser = CommonHelper.GetUser();
     const from = new Date(this.fromDate);
    from.setDate(from.getDate() - 15);
    this.oTouristTripFilterDto.StartDate = from;
  
    const to = new Date(this.toDate);
    to.setDate(to.getDate() + 15);
    this.oTouristTripFilterDto.EndDate = to;

    this.oTouristTripFilterDto.IsActive = CommonHelper.booleanConvert(this.oTouristTripFilterDto.IsActive);
    this.oTouristTripFilterDto.ServiceDetailId=Number(this.oTouristTripFilterDto.ServiceDetailId);
    this.oTouristTripFilterDto.UserId = CommonHelper.GetUser()?.UserId ?? '';
    

    // After the hash is generated, proceed with the API call
    this.http.Post(`TouristTrip/GetTouristTrip?pageNumber=${this.pageIndex ? this.pageIndex : 1}`, this.oTouristTripFilterDto).subscribe(
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
   PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetTouristTrip();
  }

}
