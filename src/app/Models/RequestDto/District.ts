
export class DistrictFilterDto {

    constructor() {
        this.UserId = "";
        this.Name = "";
        this.Type = 0;
        this.Lat ="";
        this.Long = "";
        this.IsActive = true;
    }
    public UserId: string;
    public Name: string;
    public Type: number;
    public Lat: string;
    public Long: string;
    public IsActive: boolean;
}