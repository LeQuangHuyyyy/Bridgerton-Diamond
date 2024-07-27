package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.DiamondDTO;
import org.example.diamondshopsystem.dto.DiamondPriceDTO;
import org.example.diamondshopsystem.entities.Diamond;
import org.example.diamondshopsystem.entities.DiamondPrice;
import org.example.diamondshopsystem.entities.Products;

import java.util.List;

public interface DiamondServiceImp {
    List<Diamond> getDiamondWithoutProduct();

    void createDiamond(DiamondDTO diamondDTO);

    DiamondDTO updateDiamond(DiamondDTO diamondDTO);

    void deleteDiamond(int id) throws Exception;

    List<DiamondDTO> getAllDiamonds();

    DiamondDTO getDiamondById(int id);

    List<DiamondDTO> getDiamondsBy4C(DiamondDTO diamondDTO);

    void updateDiamondPrice(DiamondPriceDTO diamondPriceDTO);

    DiamondDTO getDiamondByProductId(int productId);

    boolean setProductForDiamond(int diamondId, Products products);

    List<DiamondDTO> getAllDiamondWithoutProduct(int productId);
}
