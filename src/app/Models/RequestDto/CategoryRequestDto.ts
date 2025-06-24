export class CategoryRequestDto {

    constructor() {
        this.name = '';
        this.companyId = 0;
        this.isActive = true;
        this.remarks = "";
        this.ipAddress = "";
    }
    public name: string;
    public remarks: string;
    public companyId: number;
    public isActive: boolean;
    public ipAddress: string;
}