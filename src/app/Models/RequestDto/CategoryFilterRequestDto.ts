export class CategoryFilterRequestDto {

    constructor() {
        this.name = '';
        this.companyId = 0;
        this.isActive = true;
    }
    public name: string;
    public companyId: number;
    public isActive: boolean;
}