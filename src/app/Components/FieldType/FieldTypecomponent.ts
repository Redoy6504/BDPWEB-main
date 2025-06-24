import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { AGGridHelper } from '../../Shared/Services/AGGridHelper';
import { AuthService } from '../../Shared/Services/auth.service';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { Router } from '@angular/router';
import { FieldTypeFilterRequestDto, FieldTypeRequestDto } from '../../Models/RequestDto/FieldTypeRequestDto';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { PaginationComponent } from "../../Shared/pagination/pagination.component";

@Component({
  selector: 'app-FieldType',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './FieldType.component.html',
  styleUrl: './FieldType.component.scss',
  providers: [DatePipe]
})
export class FieldTypeComponent implements OnInit {

  private FieldTypeGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oFieldTypeFilterRequestDto = new FieldTypeFilterRequestDto();
  public oFieldTypeRequestDto = new FieldTypeRequestDto();

  public FieldTypeId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'label', width: 150, headerName: 'Label', filter: true },
    { field: 'fieldType', width: 150, headerName: 'Field Type', filter: true },
    { field: 'remarks', headerName: 'Remarks' },
    { field: 'isActive', headerName: 'Status' },
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
    this.GetFieldType();
  }

  onGridReadyTransection(params: any) {
    this.FieldTypeGridApi = params.api;
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
    this.GetFieldType();
  }
  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetFieldType();
  }
  private GetFieldType() {

    let currentUser = CommonHelper.GetUser();
    this.oFieldTypeFilterRequestDto.companyId = Number(0);
    this.oFieldTypeFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oFieldTypeFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FieldType/GetFieldType?pageNumber=${this.pageIndex}`, this.oFieldTypeFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.FieldTypeGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public InsertFieldType() {
  
    if (this.oFieldTypeRequestDto.label == "") {
      this.toast.warning("Please enter label", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oFieldTypeRequestDto.companyId = Number(0);
    this.oFieldTypeRequestDto.isActive = CommonHelper.booleanConvert(this.oFieldTypeRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FieldType/InsertFieldType`, this.oFieldTypeRequestDto).subscribe(
      (res: any) => {
        if(res.statusCode!=200){
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        }else{
          CommonHelper.CommonButtonClick("closeCommonModel");
          this.GetFieldType();
          this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        }

      },
      (err) => {
        this.toast.error(err.message, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateFieldType() {

    if (this.oFieldTypeRequestDto.label == "") {
      this.toast.warning("Please enter label", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oFieldTypeRequestDto.companyId = Number(0);
    this.oFieldTypeRequestDto.isActive = CommonHelper.booleanConvert(this.oFieldTypeRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FieldType/UpdateFieldType/${this.FieldTypeId}`, this.oFieldTypeRequestDto).subscribe(
      (res: any) => {
        if(res.statusCode!=200){
          this.toast.warning(res.message, "Warning!!", { progressBar: true });
        }
        else{
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetFieldType();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
        }
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteFieldType() {
    let currentUser = CommonHelper.GetUser();
    this.oFieldTypeRequestDto.companyId = Number(0);
    this.oFieldTypeRequestDto.isActive = CommonHelper.booleanConvert(this.oFieldTypeRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FieldType/DeleteFieldType/${this.FieldTypeId}`, this.oFieldTypeRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetFieldType();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oFieldTypeRequestDto = new FieldTypeRequestDto();
    this.FieldTypeId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.FieldTypeGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.FieldTypeId = Number(getSelectedItem.id);
    this.oFieldTypeRequestDto.label = getSelectedItem.label;
    this.oFieldTypeRequestDto.fieldType = getSelectedItem.fieldType;
    this.oFieldTypeRequestDto.companyId = Number(getSelectedItem.companyId);
    this.oFieldTypeRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oFieldTypeRequestDto.remarks = getSelectedItem.remarks;
    this.oFieldTypeRequestDto.ipAddress = getSelectedItem.ipAddress;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.FieldTypeGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.FieldTypeId = Number(getSelectedItem.id);
    this.oFieldTypeRequestDto.label = getSelectedItem.label;
    this.oFieldTypeRequestDto.fieldType = getSelectedItem.fieldType;
    this.oFieldTypeRequestDto.companyId = Number(getSelectedItem.companyId);
    this.oFieldTypeRequestDto.isActive = getSelectedItem.isActive;
    this.oFieldTypeRequestDto.remarks = getSelectedItem.remarks;
    this.oFieldTypeRequestDto.ipAddress = getSelectedItem.ipAddress;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageIndex = pageNumber;
      this.GetFieldType();
    }
  }
  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetFieldType();
    }
  }
  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetFieldType();
    }
  }



}
