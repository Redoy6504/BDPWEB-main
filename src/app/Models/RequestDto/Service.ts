export class ServiceRequestDto {

    constructor() {
        this.Name = '';
        this.Icon = '';
        this.Type = 0;
        this.Description = "";
        this.Remarks = "";
        this.IsActive = true;
        this.Link = ""
        this.UserID = ""
    }
    public Name: string;
    public Icon: string;
    public Type: number;
    public Description: string;
    public Remarks: string;
    public IsActive: boolean;
    public Link: string;
    public UserID: string;
}

export class ServiceFilterDto {

    constructor() {
        this.Name = '';
        this.Type = 0;
        this.IsActive = true;
    }
    public Name: string;
    public Type: number;
    public IsActive: boolean;
}