class CartModel{
    productId: number;
    productName: string;
    price: number;
    image1: string;
    totalPrice: number;
    quantity: number;
    size: string;

    constructor(productId: number, productName: string, price: number, image1: string, totalPrice: number, quantity: number, size: string){
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.image1 = image1;
        this.totalPrice = totalPrice;
        this.quantity = quantity;
        this.size = size;
    }
}
export default CartModel;