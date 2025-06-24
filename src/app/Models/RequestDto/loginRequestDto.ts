export class LoginRequestDto {

    constructor() {
        this.UserName = '';
        this.Password = '';
    }

    public UserName: string;
    public Password: string;
}