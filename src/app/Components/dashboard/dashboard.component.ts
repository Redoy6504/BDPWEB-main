import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgCharts } from 'ag-charts-angular';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Services/auth.service';
import { HttpHelperService } from '../../Shared/Services/http-helper.service';
import { CurrentUseerResponseDto } from '../../Models/ResponseDto/CurrentUseerResponseDto';
import { MerchantInfo } from '../../Models/ResponseDto/MerchantInfo';
import { CommonHelper } from '../../Shared/Services/CommonHelper';
import { CategoryFilterRequestDto } from '../../Models/RequestDto/CategoryFilterRequestDto';
import { DashboardFilterRequestDto } from '../../Models/RequestDto/Dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AgCharts, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DatePipe, ToastrService]
})
export class DashboardComponent implements OnInit {

  options: any;
  optionspClassWise: any;
  optionspaymenttype: any;
  optionsppaymentcategory: any;

  public fromDate: any = "";
  public toDate: any = "";
  public initialize: number = 0;
  public success: number = 0;
  public cancel: number = 0;
  public failure: number = 0;

  dashboardDataList: any[] = [];
  optionsPaymentTypeList: any[] = [];
  optionsClassWiseList: any[] = [];
  optionsPaymentCategoryList: any[] = [];

  merchantStoreList: any[] = [];
  categoryList: any[] = [];
  subCategoryList: any[] = [];
  public oCurrentUseerResponseDto = new CurrentUseerResponseDto();
  public oDashboardFilterRequestDto = new DashboardFilterRequestDto();

  public oMerchantInfo = new MerchantInfo();

  trackByFn: TrackByFunction<any> | any;
  constructor(public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe) {
    const currentYear = new Date().getFullYear();
    const firstDateOfYear = new Date(currentYear, 0, 1); // January is 0 in JavaScript Date
    this.fromDate = this.datePipe.transform(firstDateOfYear, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    // this.GetDashboardGraph();
    this.options = {
      title: {
        text: "Transaction Summary",
      },
      // subtitle: {
      //   text: "In Billion U.S. Dollars",
      // },
      data: this.dashboardDataList,
      series: [
        {
          type: "bar",
          xKey: "month",
          yKey: "initialize",
          yName: "Initialize",
          fill: '#ffc107', // Yellow (color for Initialize)
        },
        {
          type: "bar",
          xKey: "month",
          yKey: "success",
          yName: "Success",
          fill: '#28a745', // Green (color for Success)
        },
        {
          type: "bar",
          xKey: "month",
          yKey: "cancel",
          yName: "Cancel",
          fill: '#6c757d', // Gray (color for Cancel)
        },
        {
          type: "bar",
          xKey: "month",
          yKey: "failure",
          yName: "Failure",
          fill: '#dc3545', // Red (color for Failure)
        }
      ],
    };

    this.optionspClassWise = {
      data: this.optionsClassWiseList,
      title: {
        text: "Class wise successfull payment",
      },
      series: [
        {
          type: "pie",
          angleKey: "SuccessPercentage",
          calloutLabelKey: "Name",
          sectorLabelKey: "SuccessPercentage",
          sectorLabel: {
            color: "white",
            fontWeight: "bold",
            formatter: ({ value = 0 }) => `${value}%`,
          },
          fills: [
            "#FF6384", // Red
            "#36A2EB", // Blue
            "#FFCE56", // Yellow
            "#D32F2F", // Dark Red
            "#4BC0C0", // Teal
            "#9966FF", // Purple
            "#FF9F40", // Orange
            "#8DD1E1", // Light Blue
            "#FFCD94", // Peach
            "#4CAF50", // Green

          ],
          strokes: ["#FFFFFF"],
        },
      ],

    }

    this.optionspaymenttype = {
      data: this.optionsPaymentTypeList,
      title: {
        text: "Payment Medium",
      },
      series: [
        {
          type: "pie",
          angleKey: "Percentage",
          calloutLabelKey: "FinancialEntity",
          sectorLabelKey: "Percentage",
          sectorLabel: {
            color: "white",
            fontWeight: "bold",
            formatter: ({ value = 0 }) => `${(value)}%`,
          },
          fills: ["#ff8b00", "#ff0090", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          strokes: ["#FFFFFF"],
        },
      ],
    };


    this.optionsppaymentcategory = {

      data: this.optionsPaymentCategoryList,

      title: {
        text: "Payment Category",
      },
      series: [
        {
          type: "pie",
          angleKey: "CategoryPercentage",
          calloutLabelKey: "PaymentCategory",
          sectorLabelKey: "CategoryPercentage",
          fills: ["#00c10f", "#36A2EB", "#FFCE56", "#4BC0C0"],
          strokes: ["#FFFFFF"]
        },
      ],
    }
  }


  ngOnInit(): void {
    let currentUser = CommonHelper.GetUser();
    var daata = this.authService.isTokenExpired(currentUser?.JwtToken);
    // this.GetAllCategories();
  }


  Filter() {
    this.GetDashboardGraph();
  }
  getData() {
    return [
      {
        month: "January",
        initialize: 140,
        success: 16,
        cancel: 14,
        failure: 12,
      }
    ];
  }

  

  private GetDashboardGraph() {

    let currentUser = CommonHelper.GetUser();
    this.oDashboardFilterRequestDto.startDate = this.fromDate,
      this.oDashboardFilterRequestDto.endDate = this.toDate,
      this.oDashboardFilterRequestDto.companyId = Number(0),
      this.oDashboardFilterRequestDto.categoryId = Number(this.oDashboardFilterRequestDto.categoryId),
      this.oDashboardFilterRequestDto.subCategoryId = Number(this.oDashboardFilterRequestDto.subCategoryId),
      this.oDashboardFilterRequestDto.paymentTransactionId = Number(this.oDashboardFilterRequestDto.paymentTransactionId),

      // After the hash is generated, proceed with the API call
      this.http.Post(`DashBoard/GetAllDashBoardSummaryDetails`, this.oDashboardFilterRequestDto).subscribe(
        (res: any) => {
          this.initialize = 0;
          this.success = 0;
          this.cancel = 0;
          this.failure = 0;
          res.summary.forEach((element: any) => {
            this.initialize += Number(element.InitializeCount);
            this.success += Number(element.SuccessCount);
            this.cancel += Number(element.CancelCount);
            this.failure += Number(element.FailureCount);

            this.dashboardDataList.push({
              month: element.Month,
              initialize: element.InitializeAmount,
              success: element.SuccessAmount,
              cancel: element.CancelAmount,
              failure: element.FailureAmount,
            });
          });
          // Reassign the whole options object to trigger change detection
          this.options = {
            ...this.options,
            data: this.dashboardDataList
          };

          
          this.optionsPaymentTypeList = res.paymentType;

          const filteredPaymentTypeList = this.optionsPaymentTypeList.filter(
            item => item.FinancialEntity && item.FinancialEntity.trim() !== ''
          );

  
          this.optionspaymenttype = {
            ...this.optionspaymenttype,
            data: filteredPaymentTypeList
          };


          this.optionsPaymentCategoryList = res.paymentTypeCategory;
          this.optionsppaymentcategory = {
            ...this.optionsppaymentcategory,
            data: this.optionsPaymentCategoryList
          };

          this.optionsClassWiseList = res.classWise;

          this.optionspClassWise = {
            ...this.optionspClassWise,
            data: this.optionsClassWiseList
          };
          this.cdr.detectChanges();
        },
        (err) => {
          this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
        });


  }

  private GetInActiveMerchantStore(merchantId: string) {
    // After the hash is generated, proceed with the API call
    this.http.Get("StoreInformation/GetInActiveMerchantStore?MerchantId=" + merchantId).subscribe(
      (res: any) => {
        this.merchantStoreList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      });


  }


  private GetAllCategories() {
    let currentUser = CommonHelper.GetUser();
    this.http.Get(`Category/GetAllCategories/${0}`).subscribe(
      (res: any) => {
        this.categoryList = res;
        this.oDashboardFilterRequestDto.categoryId = 0;
        this.GetAllSubCategories(this.oDashboardFilterRequestDto.categoryId);
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  categoryChangeSelectionFilter() {
    this.oDashboardFilterRequestDto.subCategoryId = 0;
    this.GetAllSubCategories(Number(this.oDashboardFilterRequestDto.categoryId))
  }
  private GetAllSubCategories(categoryId: number) {
    let currentUser = CommonHelper.GetUser();
    this.http.Get(`SubCategory/GetAllSubCategories/${categoryId}`).subscribe(
      (res: any) => {

        this.subCategoryList = res;

      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

}

