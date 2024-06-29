import DiamondPriceModel from "../../../models/DiamondPriceModel";
import React from "react";

export const DiamondElement: React.FC<{ diamond: DiamondPriceModel }> = (props) => {
    return (
        <tr>
            <td>{props.diamond.cut}</td>
            <td>{props.diamond.carat}</td>
            <td>{props.diamond.color}</td>
            <td>{props.diamond.clarity}</td>
            <td>${props.diamond.price}</td>
        </tr>
    );
}