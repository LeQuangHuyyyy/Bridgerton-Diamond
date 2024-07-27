package org.example.diamondshopsystem.services;

import jakarta.persistence.EntityManager;
import org.example.diamondshopsystem.dto.DiamondDTO;
import org.example.diamondshopsystem.dto.DiamondPriceDTO;
import org.example.diamondshopsystem.entities.Diamond;
import org.example.diamondshopsystem.entities.Products;
import org.example.diamondshopsystem.repositories.DiamondPriceRepository;
import org.example.diamondshopsystem.repositories.DiamondsRepository;
import org.example.diamondshopsystem.repositories.ProductRepository;
import org.example.diamondshopsystem.services.imp.DiamondServiceImp;
import org.example.diamondshopsystem.services.imp.ProductServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

@Service
public class DiamondService implements DiamondServiceImp {
    @Autowired
    private DiamondsRepository diamondsRepository;

    @Autowired
    private DiamondPriceRepository diamondPriceRepository;

    @Autowired
    private ProductServiceImp productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    EntityManager entityManager;

    @Override
    public List<Diamond> getDiamondWithoutProduct() {
        return diamondsRepository.findDiamondWithoutProducts();
    }

    @Transactional
    @Override
    public void createDiamond(DiamondDTO diamondDTO) {
        Diamond diamond = new Diamond();

        diamond.setCut(diamondDTO.getCut());
        diamond.setColor(diamondDTO.getColor());
        diamond.setClarity(diamondDTO.getClarity());
        diamond.setCarat(diamondDTO.getCarat());

        diamond.setPrice(diamondDTO.getPrice());
        diamond.setCertification(diamondDTO.getCertification());
        diamond.setStatus(true);

        diamondsRepository.save(diamond);
    }

    @Override
    public List<DiamondDTO> getAllDiamondWithoutProduct(int productId) {
        List<Diamond> diamond = diamondsRepository.findDiamondsByProductId(productId);
        List<Diamond> diamonds = diamondsRepository.findDiamondWithoutProduct();
        List<Diamond> result = new ArrayList<>();

        if (productId != 0) {
            result.addAll(diamond);
            result.addAll(diamonds);
        } else {
            result.addAll(diamonds);
        }

        List<DiamondDTO> diamondDTOS = new ArrayList<>();
        for (Diamond d : result) {
            DiamondDTO diamondDTO = new DiamondDTO();
            diamondDTO.setCut(d.getCut());
            diamondDTO.setPrice(d.getPrice());
            diamondDTO.setClarity(d.getClarity());
            diamondDTO.setDiamondId(d.getDiamondId());
            diamondDTO.setCarat(d.getCarat());
            diamondDTO.setColor(d.getColor());
            diamondDTO.setStatus(d.isStatus());
            if (d.getProduct() != null) {
                diamondDTO.setProductId(d.getProduct().getProductId());
            }
            diamondDTOS.add(diamondDTO);
        }
        return diamondDTOS;
    }

    @Override
    public DiamondDTO updateDiamond(DiamondDTO diamondDTO) {
        Diamond diamond = diamondsRepository.findById(diamondDTO.getDiamondId()).orElseThrow(() -> new NoSuchElementException("Cannot found diamond with id: " + diamondDTO.getDiamondId()));
        diamond.setCut(diamondDTO.getCut());
        diamond.setColor(diamondDTO.getColor());
        diamond.setClarity(diamondDTO.getClarity());
        diamond.setCarat(diamondDTO.getCarat());
        diamond.setCertification(diamondDTO.getCertification());
        diamond.setPrice(diamondDTO.getPrice());
        Diamond savedDiamond = diamondsRepository.save(diamond);

        if (diamond.getProduct() != null) {
            double price = productService.calculateTotalPrice(diamond.getProduct().getProductId());
            Products products = productRepository.findById(diamond.getProduct().getProductId()).orElseThrow(() -> new IllegalArgumentException("ke ke ke "));
            products.setPrice(price);
            productRepository.save(products);
        }
        return mapDiamondToDiamondDTO(savedDiamond);
    }


    @Override
    public void deleteDiamond(int id) throws Exception {
        Diamond diamond = diamondsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cannot found diamond with id: " + id));
        if (diamond.getProduct() == null) {
            diamond.setStatus(false);
            diamond.setPrice(0);
            diamondsRepository.save(diamond);   // xóa thì doi status thoi
        } else {
            productService.updateProductPrice(diamond);
            throw new Exception("Cannot delete this diamond");
        }
    }

    @Override
    public List<DiamondDTO> getAllDiamonds() {
        List<Diamond> diamonds = diamondsRepository.findAll();
        List<DiamondDTO> diamondDTOs = new ArrayList<>();
        for (Diamond diamond : diamonds) {
            if (diamond.isStatus()) {
                diamondDTOs.add(mapDiamondToDTO(diamond));
            }
        }
        return diamondDTOs;
    }

    @Override
    public DiamondDTO getDiamondById(int id) {
        Diamond diamond = diamondsRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Cannot found diamond with id: " + id));
        return mapDiamondToDiamondDTO(diamond);
    }

    @Override
    public List<DiamondDTO> getDiamondsBy4C(DiamondDTO diamondDTO) {
        double carat = diamondDTO.getCarat();
        String color = diamondDTO.getColor();
        String clarity = diamondDTO.getClarity();
        String cut = diamondDTO.getCut();

        List<Diamond> diamondList = diamondsRepository.findAllByCaratAndCutAndColorAndClarity(carat, cut, color, clarity);
        List<DiamondDTO> diamondDTOs = new ArrayList<>();
        for (Diamond diamond : diamondList) {
            diamondDTOs.add(mapDiamondToDiamondDTO(diamond));
        }
        return diamondDTOs;
    }

    @Override
    public void updateDiamondPrice(DiamondPriceDTO diamondPriceDTO) {
        double carat = diamondPriceDTO.getCarat();
        String color = diamondPriceDTO.getColor();
        String clarity = diamondPriceDTO.getClarity();
        String cut = diamondPriceDTO.getCut();
        List<Diamond> diamonds = diamondsRepository.findAllByCaratAndCutAndColorAndClarity(carat, cut, color, clarity);
        for (Diamond diamond : diamonds) {
            diamond.setPrice(diamondPriceDTO.getPrice());
            diamondsRepository.save(diamond);
            productService.updateProductPrice(diamond);
        }
    }

    @Override
    public DiamondDTO getDiamondByProductId(int productId) {
        Diamond diamond = diamondsRepository.findFirstAvailableDiamondByProductId(productId);
        if (diamond != null) {
            return mapDiamondToDiamondDTO(diamond);
        } else {
            throw new NoSuchElementException("Cannot find diamond with productId: " + productId);
        }
    }


    DiamondDTO mapDiamondToDiamondDTO(Diamond diamond) {
        DiamondDTO diamondDTO = new DiamondDTO();
        diamondDTO.setDiamondId(diamond.getDiamondId());
        diamondDTO.setCut(diamond.getCut());
        diamondDTO.setClarity(diamond.getClarity());
        diamondDTO.setColor(diamond.getColor());
        diamondDTO.setCarat(diamond.getCarat());
        diamondDTO.setPrice(diamond.getPrice());
        diamondDTO.setCertification(diamond.getCertification());
        if (diamond.getProduct() != null) {
            diamondDTO.setProductId(diamond.getProduct().getProductId());
        }
        diamondDTO.setStatus(diamond.isStatus());
        return diamondDTO;
    }

    DiamondDTO mapDiamondToDTO(Diamond diamond) {
        DiamondDTO diamondDTO = new DiamondDTO();
        diamondDTO.setDiamondId(diamond.getDiamondId());
        diamondDTO.setCut(diamond.getCut());
        diamondDTO.setClarity(diamond.getClarity());
        diamondDTO.setColor(diamond.getColor());
        diamondDTO.setCarat(diamond.getCarat());
        diamondDTO.setPrice(diamond.getPrice());
        diamondDTO.setCertification(diamond.getCertification());

        diamondDTO.setStatus(diamond.isStatus());
        return diamondDTO;
    }

    @Transactional
    @Override
    public boolean setProductForDiamond(int diamondId, Products products) {
        Diamond diamond = diamondsRepository.findById(diamondId).orElseThrow(() -> new IllegalArgumentException("cannot find diamond"));
        try {
            diamond.setProduct(products);
            diamondsRepository.save(diamond);
            return true;
        } catch (Exception e) {
        }
        return false;
    }
}
