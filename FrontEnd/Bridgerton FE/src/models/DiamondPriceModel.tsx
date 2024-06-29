class DiamondPriceModel {
    diamondId: number;
    cut: string;
    carat: number;
    color: string;
    clarity: string;
    price: number;

    constructor(diamondId: number, cut: string, carat: number, color: string, clarity: string, price: number) {
        this.diamondId = diamondId;
        this.cut = cut;
        this.carat = carat;
        this.color = color;
        this.clarity = clarity;
        this.price = price;
    }
}
export default DiamondPriceModel;