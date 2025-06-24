export class TouristTripRequestDto {
  constructor() {
    this.UserId = '';
    this.StartDate = new Date();
    this.EndDate = new Date();
    this.NoOfTourist = 0;
    this.ServiceDetailId = 0;
    this.TouristPlace = '';
    this.Remarks = '';
    this.IsActive = true;
  }

  public UserId: string;
  public StartDate: Date;
  public EndDate: Date;
  public NoOfTourist: number;
  public ServiceDetailId: number;
  public TouristPlace: string;
  public Remarks: string;
  public IsActive: boolean;
}



export class TouristTripFilterDto {
  constructor() {
    this.UserId = '';
    this.StartDate = null;
    this.EndDate = null;
    this.ServiceDetailId = null;
    this.TouristPlace = '';
    this.IsActive = true;
  }

  public UserId: string;
  public StartDate: Date | null;
  public EndDate: Date | null;
  public ServiceDetailId: number | null;
  public TouristPlace: string;
  public IsActive: boolean;
}
