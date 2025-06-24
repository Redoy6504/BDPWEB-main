export class FieldTypeRequestDto {

    constructor() {
        this.label = '';
        this.fieldType = '';
        this.companyId = 0;
        this.isActive = true;
        this.remarks = "";
        this.ipAddress = ""
    }
    public label: string;
    public fieldType: string;
    public remarks: string;
    public companyId: number;
    public isActive: boolean;
    public ipAddress: string;
}
export class FieldTypeFilterRequestDto {

    constructor() {
        this.label = '';
        this.companyId = 0;
        this.isActive = true;
    }
    public label: string;
    public companyId: number;
    public isActive: boolean;
}