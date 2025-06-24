export class DashboardFilterRequestDto {

    constructor() {
        this.startDate = new Date();
        this.endDate = new Date();
        this.companyId = 0;
        this.categoryId = 0;
        this.subCategoryId = 0;
        this.paymentTransactionId = 0;
   
    }
    public startDate: Date;
    public endDate: Date;
    public categoryId: number;
    public companyId: number;
    public subCategoryId: number;
    public paymentTransactionId: number;
}