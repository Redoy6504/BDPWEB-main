export class MenuPermissionFilterRequestDto {

    constructor() {
        this.companyId = 0;
        this.userID = '';
        this.isActive = true;
    }


    public companyId: number;
    public userID: string;
    public isActive: boolean;
}

export class MenuPermissionRequestDto {

    constructor() {
        this.userID = '';
        this.menuId = 0;
        this.companyId = 0;
        this.name = '';
        this.isActive = true;
        this.remarks = '';
        this.iPAddress = '';


    }
    public userID: string;
    public menuId: number;
    public companyId: number;
    public name: string;
    public remarks: string;
    public isActive: boolean;
    public iPAddress: string;
}

export class MenuPerRequestDto {

    constructor() {
        this.userID = '';
        this.companyId = 0;
        this.isActive = true;
        this.remarks = '';
        this.iPAddress = '';
        this.menues = [];

    }
    public userID: string;
    public companyId: number;
    public remarks: string;
    public isActive: boolean;
    public iPAddress: string;
    public menues: Menues[];
}

export class Menues {

    constructor() {
        this.menuId = 0;
        this.name = '';
    }
    public menuId: number;
    public name: string;
}
