export class MerchantInfo {
    merchantId: string;
    id: number;
    domainName: string;
    bankName: string;
    businessCategory: string;
    businessCategoryId: number;
    businessType: string;
    businessTypeId: number;
    companyAddress: string;
    companyName: string;
    contactNumberofBusinessOwner: string;
    emailAddress: string;
    escrowSystem: string;
    escrowSystemId: number;
    merchantImage: string;
    merchantName: string;
    securityAnswer: string;
    securityQuestion: string;
    securityQuestionId: number;
    tradeLicense: string;
    userName: string | null;
    websiteURL: string;
  
    constructor() {
      this.merchantId ="";
      this.id =0;
      this.domainName ="";
      this.bankName ="";
      this.businessCategory ="";
      this.businessCategoryId =0;
      this.businessType ="";
      this.businessTypeId =0;
      this.companyAddress ="";
      this.companyName ="";
      this.contactNumberofBusinessOwner ="";
      this.emailAddress ="";
      this.escrowSystem ="";
      this.escrowSystemId =0;
      this.merchantImage ="";
      this.merchantName ="";
      this.securityAnswer ="";
      this.securityQuestion ="";
      this.securityQuestionId =0;
      this.tradeLicense ="";
      this.userName ="";
      this.websiteURL ="";
    }
  }