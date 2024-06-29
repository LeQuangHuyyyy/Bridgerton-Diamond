package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.DiamondDTO;
import org.example.diamondshopsystem.dto.DiamondPriceDTO;
import org.example.diamondshopsystem.entities.DiamondPrice;

import java.util.List;

public interface DiamondServiceImp {
    DiamondDTO createDiamond(DiamondDTO diamondDTO);
    DiamondDTO updateDiamond(DiamondDTO diamondDTO);
    DiamondDTO deleteDiamond(int id);
    List<DiamondDTO> getAllDiamonds();
    DiamondDTO getDiamondById(int id);
    List<DiamondDTO> getDiamondsBy4C(DiamondDTO diamondDTO);
    void updateDiamondPrice(DiamondPriceDTO diamondPriceDTO);
    DiamondDTO getDiamondByProductId(int productId);
}
