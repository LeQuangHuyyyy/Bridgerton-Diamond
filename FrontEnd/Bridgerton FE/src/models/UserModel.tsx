class UserModel {
    name: string;
    password: string;
    phoneNumber: string;
    email: string;
    address: string;

    constructor(name: string, password: string, phoneNumber: string, email: string, address: string) {
        this.name = name;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.address = address;
    }
}
export default UserModel;