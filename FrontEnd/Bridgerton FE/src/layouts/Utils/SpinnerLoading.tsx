export const SpinnerLoading = () => {
    return (
        <div className="container m-5 ms-5 d-flex justify-content-center align-items-center vh-100"
        style={{height: 550}}>
            <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">
                    Loading...
                </span>
            </div>
        </div>
    );
}