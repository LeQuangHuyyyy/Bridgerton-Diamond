class PromotionModel {
    codeId: number;
    code: string;
    name: string;
    startDate: string;
    endDate: string;
    discountPercentTage: number;
    codeQuantity: number;

    constructor(codeId: number, code: string, name: string, startDate: string, endDate: string, discountPercentTage: number, codeQuantity: number) {
        this.codeId = codeId;
        this.code = code;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.discountPercentTage = discountPercentTage;
        this.codeQuantity = codeQuantity;
    }
}
export default PromotionModel;