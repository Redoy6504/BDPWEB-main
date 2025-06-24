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
import { ComplainFilterDto, ComplainRequestDto } from '../../Models/RequestDto/Complain';
import { ThanaFilterDto } from '../../Models/RequestDto/Thana';
import { DistrictFilterDto } from '../../Models/RequestDto/District';
import { ValueFormatterParams } from 'ag-grid-community';

@Component({
  selector: 'app-complain',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './complain.component.html',
  styleUrl: './complain.component.scss',
  providers: [DatePipe]
})
export class ComplainComponent {
  private complainGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oComplainFilterDto = new ComplainFilterDto();
  public oComplainRequestDto = new ComplainRequestDto();


  public districtList: any[] = [];
  public districtFromList: any[] = [];
  public thanaList: any[] = [];
  public thanaFromList: any[] = [];

  public oThanaFilterDto = new ThanaFilterDto();
  public oThanaFilterDtoFrom = new ThanaFilterDto();
  public oDistrictFilterDto = new DistrictFilterDto();

  public ComplainId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public complainCategories: any[] = []; 

  public fromDate: any;
  public toDate: any;

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'Name', width: 150, headerName: 'Complain Name', filter: true },
    {
      field: 'Type', width: 150, headerName: 'Type', filter: true, cellRenderer: (params: any) => {
        let color = '';
        let text = '';

        switch (params.value) {
          case '1':
            text = 'Found';
            color = 'green';
            break;
          case '2':
            text = 'Lost';
            color = 'red';
            break;
          case '3':
            text = 'Complain';
            color = 'orange';
            break;
          default:
            text = params.value;
            color = 'black';
        }

        return `<span style="color: ${color}; font-weight: bold;">${text}</span>`;
      }
    },
    { field: 'Description', width: 150, headerName: 'Description', filter: true },
   {
  field: 'StartDate', 
  width: 150, 
  headerName: 'Date', 
  filter: true,
  valueFormatter: (params: ValueFormatterParams) => {
    return this.datePipe.transform(params.value, 'MMM d, y, h:mm:ss a');
  }
},
    { field: 'Remarks', headerName: 'Remarks' },
    {
      field: 'Status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        let label = '';
        let colorClass = '';

        switch (params.value) {
          case 1:
            label = 'In Progress';
            colorClass = 'badge bg-warning text-dark';
            break;
          case 2:
            label = 'Found';
            colorClass = 'badge bg-success';
            break;
          case 3:
            label = 'Lost';
            colorClass = 'badge bg-danger';
            break;
          case 4:
            label = 'Solved';
            colorClass = 'badge bg-primary';
            break;
          default:
            label = 'Unknown';
            colorClass = 'badge bg-secondary';
            break;
        }

        return `<span class="${colorClass}">${label}</span>`;
      }
    }


    //{ field: 'Status', headerName: 'Status', cellRenderer: (params: any) => params.value ? 'Active' : 'Inactive' },
  ];
  trackByFn: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
    this.fromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

private GetComplainCategories() {
  debugger
  this.http.Get(`Complain/GetComplaincategory`).subscribe(
    (res: any) => {
      this.complainCategories = res;
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

  get isComplainType(): boolean {
    return this.oComplainRequestDto.Type == '3';
  }



  public onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      debugger
      //this.http.UploadFile(`FileManagement/FileUpload`, file).subscribe(
      this.http.UploadFile(`UploadedFile/Upload`, file).subscribe(
        (res: any) => {
          this.oComplainRequestDto.FileId = Number(res.Id);
        },
        (err) => {
          console.log(err.ErrorMessage);
        }
      );
    }

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

  public districtChange() {
    this.GetThanas();
  }
  public districtChangeFrom() {

    this.oThanaFilterDtoFrom.DistinctId = this.oComplainRequestDto.DistrictId;
    this.GetThanasFrom();
  }



  ngOnInit(): void {
    this.GetComplains();
    this.GetDistricts();
    this.GetComplainCategories();

  }

  onGridReadyTransection(params: any) {
    this.complainGridApi = params.api;
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
    this.GetComplains();
  }
  private GetComplains() {
    debugger;
    let currentUser = CommonHelper.GetUser();
    const from = new Date(this.fromDate);
    from.setDate(from.getDate() - 15);
    this.oComplainFilterDto.FromDate = from;

    const to = new Date(this.toDate);
    to.setDate(to.getDate() + 15);
    this.oComplainFilterDto.ToDate = to;

    // this.oComplainFilterDto.FromDate = new Date(this.fromDate)
    // this.oComplainFilterDto.ToDate = new Date(this.toDate);
    this.oComplainFilterDto.Status = Number(this.oComplainFilterDto.Status);
    this.oComplainFilterDto.ComplainCatagoryType = Number(this.oComplainFilterDto.ComplainCatagoryType);
    this.oComplainFilterDto.IsActive = CommonHelper.booleanConvert(this.oComplainFilterDto.IsActive);


    this.http.Post(`Complain/GetComplains?pageNumber=${this.pageIndex}`, this.oComplainFilterDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.Items;
        this.pageIndex = res.PageIndex;
        this.totalPages = res.TotalPages;
        this.totalRecords = res.TotalRecords;
        this.hasPreviousPage = res.HasPreviousPage;
        this.hasNextPage = res.HasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages);
      },
      (err) => {
        this.toast.error(err?.ErrorMessage || "Something went wrong", "Error!!", { progressBar: true });
      }
    );
  }

  // private GetComplains() {
  //   debugger
  //   let currentUser = CommonHelper.GetUser();
  //   this.oComplainFilterDto .IsActive = CommonHelper.booleanConvert(this.oComplainFilterDto.IsActive);
  //   this.oComplainFilterDto.Type = (this.oComplainFilterDto.Type);
  //   // After the hash is generated, proceed with the API call
  //   this.http.Post(`Complain/GetComplains?pageNumber=${this.pageIndex}`, this.oComplainFilterDto).subscribe(
  //     (res: any) => {
  //       console.log(res);
  //       this.rowData = res;
  //        this.pageIndex = res.pageIndex;
  //        this.totalPages = res.totalPages;
  //        this.totalRecords = res.totalRecords;
  //         this.hasPreviousPage = res.hasPreviousPage;
  //        this.hasNextPage = res.hasNextPage;
  //        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
  //     },
  //     (err) => {
  //       this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
  //     }
  //   );

  // }

  public InsertService() {

    if (this.oComplainRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oComplainRequestDto.UserID = CommonHelper.GetUser()?.UserId ?? '';
    this.oComplainRequestDto.Status = 1;

    this.oComplainRequestDto.IsActive = CommonHelper.booleanConvert(this.oComplainRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    debugger
    this.http.Post(`Complain/InsertComplain`, this.oComplainRequestDto).subscribe(
      (res: any) => {

        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetComplains();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });


      },
      (err) => {
        this.toast.error(err.message, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateService() {

    if (this.oComplainRequestDto.Name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oComplainRequestDto.IsActive = CommonHelper.booleanConvert(this.oComplainRequestDto.IsActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Complain/UpdateComplain/${this.ComplainId}`, this.oComplainRequestDto).subscribe(
      (res: any) => {

        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetComplains();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });

      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public DeleteService() {
    debugger
    this.http.Post(`Complain/DeleteComplain/${this.ComplainId}`, this.oComplainRequestDto).subscribe(
      (res: any) => {
        // Close modal manually
        const closeBtn = document.getElementById('closeCommonDelete');
        if (closeBtn) {
          (closeBtn as HTMLButtonElement).click();
        }

        this.GetComplains();
        this.toast.success("Complaint deleted successfully!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err?.ErrorMessage || "Failed to delete complaint", "Error!!", { progressBar: true });
      }
    );
  }


  add() {
    CommonHelper.CommonButtonClick("exampleModal");
    this.oComplainRequestDto = new ComplainRequestDto();
    this.ComplainId = 0;
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }


  // edit() {
  //   let getSelectedItem = AGGridHelper.GetSelectedRow(this.complainGridApi);
  //   if (!getSelectedItem) {
  //     this.toast.warning("Please select an item", "Warning!!", { progressBar: true });
  //     return; // Add return to exit the function if no item is selected
  //   }

  //   this.ComplainId = Number(getSelectedItem.Id);

  //   // Initialize a new ComplainRequestDto and populate it with selected item data
  //   this.oComplainRequestDto = new ComplainRequestDto();

  //   // Map the selected item properties to the request DTO
  //   this.oComplainRequestDto.Id = this.ComplainId;
  //   this.oComplainRequestDto.Name = getSelectedItem.name || '';
  //   this.oComplainRequestDto.Type = getSelectedItem.type || '';
  //   this.oComplainRequestDto.Description = getSelectedItem.description || '';
  //   this.oComplainRequestDto.Remarks = getSelectedItem.remarks || '';
  //   this.oComplainRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
  //   this.oComplainRequestDto.Date = new Date(getSelectedItem.date) || new Date();
  //   this.oComplainRequestDto.FileId = getSelectedItem.fileId || 0;
  //   this.oComplainRequestDto.ThanaId = getSelectedItem.thanaId || 0;
  //   this.oComplainRequestDto.Status = getSelectedItem.status || 0;
  //   this.oComplainRequestDto.ComplainCatagoryType = getSelectedItem.complainCatagoryType || 0;

  //   // Get current user ID
  //   let currentUser = CommonHelper.GetUser();
  //   this.oComplainRequestDto.UserID = currentUser?.UserId || '';

  //   CommonHelper.CommonButtonClick("openCommonModel");
  // }


  // edit() {
  //   const getSelectedItem = AGGridHelper.GetSelectedRow(this.complainGridApi);
  //   if (!getSelectedItem) {
  //     this.toast.warning("Please select an item", "Warning!!", { progressBar: true });
  //     return;
  //   }

  //   this.ComplainId = Number(getSelectedItem.Id);
  //   this.oComplainRequestDto = new ComplainRequestDto();

  //   this.oComplainRequestDto.Id = this.ComplainId;
  //   this.oComplainRequestDto.Name = getSelectedItem.name || '';
  //   this.oComplainRequestDto.Type = (getSelectedItem.type || ' ').toString(); // ✅ Cast to string
  //   this.oComplainRequestDto.Description = getSelectedItem.description || '';
  //   this.oComplainRequestDto.Remarks = getSelectedItem.remarks || '';
  //   this.oComplainRequestDto.IsActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
  //   this.oComplainRequestDto.Date = new Date(getSelectedItem.date) || new Date();
  //   this.oComplainRequestDto.FileId = getSelectedItem.fileId || 0;
  //   this.oComplainRequestDto.ThanaId = getSelectedItem.thanaId || 0;
  //   this.oComplainRequestDto.Status = getSelectedItem.status || 0;
  //   this.oComplainRequestDto.ComplainCatagoryType = getSelectedItem.complainCatagoryType || 0;

  //   // ✅ Fix: Assign DistrictId (for dropdown to show correct value)
  //   this.oComplainRequestDto.DistrictId = getSelectedItem.districtId || getSelectedItem.DistrictId || 0;

  //   // ✅ Load thanas under this district
  //   this.districtChangeFrom();

  //   const currentUser = CommonHelper.GetUser();
  //   this.oComplainRequestDto.UserID = currentUser?.UserId || '';

  //   // ✅ Show modal the correct way
  //   const modalElement = document.getElementById('exampleModal');
  //   if (modalElement) {
  //     const modal = new (window as any).bootstrap.Modal(modalElement);
  //     modal.show();
  //   }
  // }


  edit() {
    const getSelectedItem = AGGridHelper.GetSelectedRow(this.complainGridApi);
    if (!getSelectedItem) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true });
      return;
    }

    this.ComplainId = Number(getSelectedItem.Id);
    const id = this.ComplainId;  // Fix here

    this.http.Get(`Complain/GetComplainById/${id}`).subscribe(
      (res: any) => {
        this.oComplainRequestDto = res;

        // Make sure dates are converted properly if needed, e.g.
        this.oComplainRequestDto.Date = new Date(this.oComplainRequestDto.Date);

           // Set the category ID from the response
            if (res.ComplainCatagoryType) {
                this.oComplainRequestDto.ComplainCatagoryType = res.ComplainCatagoryType;
            }

        // Load dependent dropdowns based on DistrictId
        this.districtChangeFrom();

        // Show modal
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      (err) => {
        this.toast.error("Failed to load complaint details", "Error!!", { progressBar: true });
      }
    );
  }



  delete() {
    debugger
    const selectedItem = AGGridHelper.GetSelectedRow(this.complainGridApi);
    if (!selectedItem) {
      this.toast.warning("Please select a complaint to delete.", "Warning!!", { progressBar: true });
      return;
    }

    this.ComplainId = selectedItem.Id;

    // Optionally, only set minimal data for deletion
    this.oComplainRequestDto = new ComplainRequestDto();
    this.oComplainRequestDto.Id = this.ComplainId;
    this.oComplainRequestDto.UserID = CommonHelper.GetUser()?.UserId ?? '';
    this.oComplainRequestDto.IsActive = false; // optional: flag it as "soft deleted"

    // Show confirmation modal
    const deleteModalEl = document.getElementById('staticCommonBackdrop');
    if (deleteModalEl) {
      const modal = new (window as any).bootstrap.Modal(deleteModalEl);
      modal.show();
    }
  }


  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetComplains();
  }


}
