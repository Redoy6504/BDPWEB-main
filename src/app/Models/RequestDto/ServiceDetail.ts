export class ServiceDetailRequestDto {

    constructor() {

        this.Name = '';
        this.ServiceId = 0;
        this.FileId = 0;
        this.DistictId = 0;
        this.ThanaId = 0;
        this.PhoneNo = "";
        this.TelePhone = "";
        this.Description = "";
        this.Lat = "";
        this.Long = "";
        this.Remarks = "";
        this.IsActive = true;
        this.UserID = ""
    }
    public Name: string;
    public ServiceId: number;
    public FileId: number;
    public DistictId: number;
    public ThanaId: number;
    public PhoneNo: string;
    public TelePhone: string;
    public Description: string;
    public Lat: string;
    public Long: string;
    public Remarks: string;
    public IsActive: boolean;
    public UserID: string;
}

export class ServiceDetailFilterDto {

    constructor() {
        this.Name = "";
        this.Lat = "";
        this.Long = "";
        this.ServiceId = 0;
        this.DistictId = 0;
        this.ThanaId = 0;
        this.IsActive = true;
    }
    public Name: string;
    public Lat: string;
    public Long: string;
    public ServiceId: number;
    public DistictId: number;
    public ThanaId: number;
    public IsActive: boolean;
}
