class DiamondModel {
    diamondId: number;
    carat: number;
    price: number;
    cut: string;
    color: string;
    clarity: string;
    certification: string;
    productId: string;
    status: boolean;

    constructor(diamondId: number, carat: number, price: number, cut: string, color: string, clarity: string, certification: string, productId: string, status: boolean) {
        this.diamondId = diamondId;
        this.carat = carat;
        this.price = price;
        this.cut = cut;
        this.color = color;
        this.clarity = clarity;
        this.certification = certification;
        this.productId = productId;
        this.status = status;
    }
}
export default DiamondModel;