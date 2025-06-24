export class MenuFilterRequestDto {

    constructor() {
        this.name = '';
        this.shortName = '';
        this.isActive=true;
    }
    public name: string;
    public shortName: string;
    public isActive: boolean;
}

export class MenuRequestDto {

    constructor() {
        this.name = '';
        this.shortName = '';
        this.routingPath = '';
        this.isActive = true;
        this.remarks = '';
        this.iPAddress = '';
        
      
    }
    public name: string;
    public shortName: string;
    public routingPath: string;
    public isActive: boolean;
    public remarks: string;
    public iPAddress: string;
}