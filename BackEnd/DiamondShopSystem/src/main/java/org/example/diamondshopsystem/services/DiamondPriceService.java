package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.DiamondPriceDTO;
import org.example.diamondshopsystem.entities.DiamondPrice;
import org.example.diamondshopsystem.repositories.DiamondPriceRepository;
import org.example.diamondshopsystem.services.imp.DiamondPriceServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class DiamondPriceService implements DiamondPriceServiceImp {

    @Autowired
    DiamondPriceRepository diamondPriceRepository;

    @Override
    public DiamondPriceDTO createDiamondPrice(DiamondPriceDTO diamondPriceDTO) {
        DiamondPrice diamondPrice = new DiamondPrice();
        diamondPrice.setPrice(diamondPriceDTO.getPrice());
        diamondPrice.setCarat(diamondPriceDTO.getCarat());
        diamondPrice.setClarity(diamondPriceDTO.getClarity());
        diamondPrice.setColor(diamondPriceDTO.getColor());
        diamondPrice.setCut(diamondPriceDTO.getCut());
        DiamondPrice savedDiamondPrice = diamondPriceRepository.save(diamondPrice);
        return mapDiamondPriceToDTO(savedDiamondPrice);
    }

    @Override
    public List<DiamondPriceDTO> getAllDiamondPrices() {
        List<DiamondPrice> diamondPrices = diamondPriceRepository.findAll();
        List<DiamondPriceDTO> diamondPriceDTOs = new ArrayList<DiamondPriceDTO>();
        for (DiamondPrice diamondPrice : diamondPrices) {
            diamondPriceDTOs.add(mapDiamondPriceToDTO(diamondPrice));
        }
        return diamondPriceDTOs;
    }

    @Override
    public DiamondPriceDTO getDiamondPrice(int id) {
        DiamondPrice diamondPrice = diamondPriceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Can not found diamond price with id: " + id));
        return mapDiamondPriceToDTO(diamondPrice);
    }

    @Override
    public DiamondPriceDTO getDiamondPriceBy4C(double carat, String cut, String color, String clarity) {
        DiamondPrice diamondPrice = diamondPriceRepository.findByCaratAndCutAndColorAndClarity(carat, cut, color, clarity);
        if (diamondPrice == null) {
            return null;
        }
        return mapDiamondPriceToDTO(diamondPrice);
    }

    @Override
    public DiamondPriceDTO updateDiamondPrice(DiamondPriceDTO diamondPriceDTO) {
        DiamondPrice diamondPrice = diamondPriceRepository.findById(diamondPriceDTO.getDiamondId())
                .orElseThrow(() -> new NoSuchElementException("Can not found diamond price with id: " + diamondPriceDTO.getDiamondId()));
        diamondPrice.setPrice(diamondPriceDTO.getPrice());
        diamondPrice.setCarat(diamondPriceDTO.getCarat());
        diamondPrice.setClarity(diamondPriceDTO.getClarity());
        diamondPrice.setColor(diamondPriceDTO.getColor());
        diamondPrice.setCut(diamondPriceDTO.getCut());
        DiamondPrice updatedDiamondPrice = diamondPriceRepository.save(diamondPrice);
        return mapDiamondPriceToDTO(updatedDiamondPrice);
    }

    @Override
    public DiamondPriceDTO deleteDiamondPrice(int id) {
        DiamondPrice diamondPrice = diamondPriceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Can not found diamond price with id: " + id));
        diamondPriceRepository.delete(diamondPrice);
        return mapDiamondPriceToDTO(diamondPrice);
    }

    private DiamondPriceDTO mapDiamondPriceToDTO(DiamondPrice diamondPrice) {
        DiamondPriceDTO diamondPriceDTO = new DiamondPriceDTO();
        diamondPriceDTO.setDiamondId(diamondPrice.getDiamondId());
        diamondPriceDTO.setCut(diamondPrice.getCut());
        diamondPriceDTO.setColor(diamondPrice.getColor());
        diamondPriceDTO.setClarity(diamondPrice.getClarity());
        diamondPriceDTO.setCarat(diamondPrice.getCarat());
        diamondPriceDTO.setPrice(diamondPrice.getPrice());
        return diamondPriceDTO;
    }
}
