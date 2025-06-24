export class ComplainRequestDto {
    
    constructor() {
        this.Id = 0;
        this.Name = '';
        this.Date = new Date();
        this.Type = '';
        this.FileId = 0;
        this.ThanaId = 0;
        this.DistrictId= 0; 
        this.Status = 0;
        this.Description = '';
        this.Remarks = '';
        this.IsActive = true;
        this.UserID = '';
        this.ComplainCatagoryType = 0;
    }

    public Id: number;
    public Name: string;
    public Date: Date;
    public Type: string;
    public FileId: number;
    public ThanaId: number;
    public DistrictId: number; 
    public Status: number;
    public Description: string;
    public Remarks: string;
    public IsActive: boolean;
    public UserID: string;
    public ComplainCatagoryType: number;
}

export class ComplainFilterDto {

    constructor() {
        this.Name = '';
        this.FromDate = new Date();
        this.ToDate = new Date();
        this.Type = '';
        this.IsActive = true;
        this.Status = 0;
        this.ComplainCatagoryType = 0;
    }
    public Name: string;
    public FromDate: Date;
    public ToDate:   Date;
    public IsActive: boolean;
    public Type: string;
    public Status: number;
    public ComplainCatagoryType: number;
    
}

