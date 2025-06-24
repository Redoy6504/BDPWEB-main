export class TransactionDetail {
  public transactionId: string;
  public customerOrderId: string;
  public transectionTypeId: any; // can be null
  public transactionTypeId: number;
  public transectionType: any; // can be null
  public transactionType: string;
  public transectionOrder: any; // can be null
  public ipAddress: string;
  public merchantTransactionId: string;
  public merchantId: string;
  public storeId: string;
  public storeName: string;
  public merchantBankId: string;
  public bankName: string | null;
  public merchantName: string;
  public financialEntityId: number;
  public financialEntity: any; // can be null
  public transitionStatusId: number;
  public transitionStatus: string;
  public isOrderIdUsed: boolean;
  public isSettlement: boolean;
  public partnerTransactionID: any; // can be null
  public totalAmount: number;
  public commissionAmount: number;
  public transactionDate: string;
  public customerName: string;
  public customerAddress: string;
  public customerPhone: string;
  public customerEmail: string;
  public apiResponseJson: string;
  public requestBody: string;
  public details_Code: any; // can be null

  constructor() {
    this.transactionId = "";
    this.customerOrderId = "";
    this.transectionTypeId = "";
    this.transactionTypeId = 0;
    this.transectionType = "";
    this.transactionType = "";
    this.transectionOrder = "";
    this.ipAddress = "";
    this.merchantTransactionId = "";
    this.merchantId = "";
    this.storeId = "";
    this.storeName = "";
    this.merchantBankId = "";
    this.bankName = "";
    this.merchantName = "";
    this.financialEntityId = 0;
    this.financialEntity = "";
    this.transitionStatusId = 0;
    this.transitionStatus = "";
    this.isOrderIdUsed = false;
    this.isSettlement = false
    this.partnerTransactionID = "";
    this.totalAmount = 0;
    this.commissionAmount = 0;
    this.transactionDate = "";
    this.customerName = "";
    this.customerAddress = "";
    this.customerPhone = "";
    this.customerEmail = "";
    this.apiResponseJson = "";
    this.requestBody = "";
    this.details_Code = "";
  }
}