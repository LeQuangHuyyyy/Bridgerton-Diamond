export const DiamondInformation = () => {
    return (
        <>
            <div className="mt-5 mb-5 text-center">
                <h2 style={{marginBottom: '45px', fontFamily: 'Playfair Display', color: '#001529', fontWeight: 'bold', fontSize: '45px'}}>QUALITY FACTORS</h2>
                <h5 style={{fontFamily: 'Petit Formal Script, cursive', marginBottom: '40px'}}>The human contribution to
                    a diamond’s beauty is a well-executed cut.</h5>
            </div>

            <div className=" mt-5 mb-5 row d-flex justify-content-center">
                <div className="col-2 text-center border-start">
                    <h4>Clarity</h4>
                    <img className="mb-5 mt-5" src="https://www.gia.edu/images/diamond-clarity.jpg" alt=""/>
                    <h6>Clarity grades assess the number, size, relief, and position of inclusions and
                        blemishes.</h6>
                </div>
                <div className="col-2 text-center border-start">
                    <h4>Color</h4>
                    <img className="mb-5 mt-5" src="https://www.gia.edu/images/diamond-color.jpg" alt=""/>
                    <h6>The less color, the higher the grade. Even the slightest hint can make a dramatic difference in
                        value.</h6>
                </div>
                <div className="col-2 text-center border-start">
                    <h4>Cut</h4>
                    <img className="mb-5 mt-5" src="https://www.gia.edu/images/diamond-cut.jpg" alt=""/>
                    <h6>Cut (proportions, symmetry, and polish) is a measure of how a diamond’s facets interact with
                        light.</h6>
                </div>
                <div className="col-2 text-center border-start">
                    <h4>Carat Weight</h4>
                    <img className="mb-5 mt-5" src="https://www.gia.edu/images/diamond-carat-weight.jpg" alt=""/>
                    <h6>Rarity means larger diamonds of the same quality are worth more per carat.</h6>
                </div>
            </div>
        </>
    );
}