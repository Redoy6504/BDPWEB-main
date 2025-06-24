export class UserResponseDto {
    constructor(
    ) {
        this.JwtToken = "";
        this.Expires = "";
        this.RefreshToken = "";
        this.RefreshTokenExpires = "";
        this.UserId = "";
        this.companyLogo = "";
    }
    public JwtToken: string;
    public Expires: string;
    public RefreshToken: string;
    public RefreshTokenExpires: string;
    public UserId: string;
    public companyLogo: string;
}