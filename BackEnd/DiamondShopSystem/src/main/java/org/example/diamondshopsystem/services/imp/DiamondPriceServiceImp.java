package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.DiamondPriceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DiamondPriceServiceImp {
    DiamondPriceDTO createDiamondPrice(DiamondPriceDTO diamondPriceDTO);

    Page<DiamondPriceDTO> getAllDiamondPrices(Pageable pageable);

    DiamondPriceDTO getDiamondPrice(int id);

    DiamondPriceDTO getDiamondPriceBy4C(double carat, String cut, String color, String clarity);

    DiamondPriceDTO updateDiamondPrice(DiamondPriceDTO diamondPriceDTO);

    DiamondPriceDTO deleteDiamondPrice(int id);
}
