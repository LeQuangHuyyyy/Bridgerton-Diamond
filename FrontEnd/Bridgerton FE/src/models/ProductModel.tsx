class ProductModel {
    productId: number;
    productName: string;
    price: number;
    stockQuantity: number;
    collection: string;
    description: string;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    categoryId: number;
    diamondId: number;
    shellId: number;


    constructor(productId: number, productName: string, price: number, stockQuantity: number, collection: string, description: string, image1: string,image2: string,image3: string,image4: string,categoryId: number, diamondId: number, shellId: number) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.collection = collection;
        this.description = description;
        this.image1 = image1;
        this.image2 = image2;
        this.image3 = image3;
        this.image4 = image4;
        this.categoryId = categoryId;
        this.diamondId = diamondId;
        this.shellId = shellId;
    }


}

export default ProductModel;