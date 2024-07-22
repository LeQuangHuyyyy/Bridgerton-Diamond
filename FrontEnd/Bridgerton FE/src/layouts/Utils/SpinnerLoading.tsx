export const SpinnerLoading = () => {
    return (
        <div className="container m-5 ms-5 d-flex justify-content-lg-center align-items-center vh-100"
             style={{height: 550}}>
            <div className="spinner-border text-dark " style={{marginLeft: "7rem"}} role="status">
                <span className="visually-hidden">
                    Loading...
                </span>
            </div>
        </div>
    );
}