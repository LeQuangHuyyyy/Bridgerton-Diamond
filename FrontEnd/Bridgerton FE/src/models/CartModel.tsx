class CartModel{
    productId: number;
    productName: string;
    price: number;
    image1: string;
    totalPrice: number;
    quantity: number;
    size: number;
    sizeId: number;

    constructor(productId: number, productName: string, price: number, image1: string, totalPrice: number, quantity: number, size: number, sizeId: number) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.image1 = image1;
        this.totalPrice = totalPrice;
        this.quantity = quantity;
        this.size = size;
        this.sizeId = sizeId;
    }
}
export default CartModel;