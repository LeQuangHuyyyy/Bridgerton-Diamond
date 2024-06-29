class ShellModel {
    shellId: number;
    shellName: string;
    shellPrice: number;
    shellMaterial: string;
    shellDesign: string;
    shellWeight: number;

    constructor(shellId: number, shellName: string, shellPrice: number, shellMaterial: string, shellDesign: string, shellWeight: number) {
        this.shellId = shellId;
        this.shellName = shellName;
        this.shellPrice = shellPrice;
        this.shellMaterial = shellMaterial;
        this.shellDesign = shellDesign;
        this.shellWeight = shellWeight;
    }
}
export default ShellModel;