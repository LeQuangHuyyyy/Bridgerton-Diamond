class WarrantyModel{
    warrantiesId: number;
    warrantyStartDate: Date;
    warrantyExpirationDate: Date;
    warrantyType: string;

    constructor(warrantiesId: number, warrantyStartDate: Date, warrantyExpirationDate: Date, warrantyType: string){
        this.warrantiesId = warrantiesId;
        this.warrantyStartDate = warrantyStartDate;
        this.warrantyExpirationDate = warrantyExpirationDate;
        this.warrantyType = warrantyType;
    }
}
export default WarrantyModel;