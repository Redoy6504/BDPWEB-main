export class CurrentUseerResponseDto {

    UserId: string;
    userName: string;
    fullName: string;
    email: string;
    merchantId: string;
    storeId: string;

    constructor(
    ) {
        this.UserId = "";
        this.userName = "";
        this.fullName = "";
        this.email = "";
        this.merchantId = "";
        this.storeId = "";
    }
}