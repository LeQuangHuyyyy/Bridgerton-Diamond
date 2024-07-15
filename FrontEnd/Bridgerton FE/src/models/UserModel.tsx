class UserModel {
    userid: number;
    name: string;
    password: string;
    phoneNumber: string;
    email: string;
    address: string;

    constructor(userid: number, name: string, password: string, phoneNumber: string, email: string, address: string) {
        this.userid = userid;
        this.name = name;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.address = address;
    }
}
export default UserModel;