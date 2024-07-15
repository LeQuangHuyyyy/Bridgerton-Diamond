class ChartData {
    date: string;
    Heart: number;
    Round: number;
    Oval: number;

    constructor(date: string, Heart: number, Round: number, Oval: number) {
        this.date = date;
        this.Heart = Heart;
        this.Round = Round;
        this.Oval = Oval;
    }
}
export default ChartData;