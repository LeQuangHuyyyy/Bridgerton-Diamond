class SizeModel {
    sizeId: number;
    valueSize: number;
    categoryId: number;

    constructor(sizeId: number, valueSize: number, categoryId: number) {
        this.sizeId = sizeId;
        this.valueSize = valueSize;
        this.categoryId = categoryId;
    }
}

export default SizeModel;