import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-response',
  standalone: true,
  imports: [],
  templateUrl: './response.component.html',
  styleUrl: './response.component.scss'
})
export class ResponseComponent implements OnInit {

  Status: any;
  MerchantTransactionId: any;
  ErrorCode: any;
  ErrorMessage: any;
  constructor(private route: ActivatedRoute) {


  }


  ngOnInit(): void {
    // Get query parameters
    this.route.queryParams.subscribe(params => {
      this.Status = params['Status'];
      this.MerchantTransactionId = params['MerchantTransactionId'];
      this.ErrorCode = params['ErrorCode'];
      this.ErrorMessage = params['ErrorMessage'];
    });
  }

}
