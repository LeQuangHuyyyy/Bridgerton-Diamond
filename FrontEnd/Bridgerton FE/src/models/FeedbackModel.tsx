class FeedbackModel{
    rating: number;
    comment: string;
    constructor(rating: number, comment: string){
        this.rating = rating;
        this.comment = comment;
    }
}
export default FeedbackModel;