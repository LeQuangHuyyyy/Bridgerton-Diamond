import React from 'react';
import {ExploreTopProducts} from "./component/ExploreTopProducts";
import {CarouselProduct} from "./component/CarouselProduct";
import {Heros} from "./component/Heros";
import  {DiamondInformation} from "./component/DiamondInfomation";

export const HomePage = () => {
    return (
        <div>
            <>
                <ExploreTopProducts/>
                <CarouselProduct/>
                <Heros/>
                <DiamondInformation/>
            </>
        </div>
    );
}