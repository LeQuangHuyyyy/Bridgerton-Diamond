package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.entities.Size;
import org.example.diamondshopsystem.repositories.SizeRepository;
import org.example.diamondshopsystem.services.imp.SizeServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SizeService implements SizeServiceImp {
    @Autowired
    SizeRepository sizeRepository;
    @Override
    public List<Size> getSizesByCategoryId(int categoryId) {
        return sizeRepository.findByCategoryCategoryId(categoryId);
    }
}
