
export class ThanaFilterDto {

   constructor() {
        this.UserId = "";
        this.Name = "";
        this.ServiceName = "";
        this.DistinctId = 0;
        this.Type = 0;
        this.Lat ="";
        this.Long = "";
        this.IsActive = true;
    }
    public UserId: string;
    public Name: string;
    public ServiceName: string;
    public Type: number;
    public DistinctId: number;
    public Lat: string;
    public Long: string;
    public IsActive: boolean;
}
