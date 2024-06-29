package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.Diamond;
import org.example.diamondshopsystem.entities.DiamondPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiamondPriceRepository extends JpaRepository<DiamondPrice, Integer> {

    @Query("SELECT dp FROM DiamondPrice dp WHERE dp.carat = :carat AND dp.cut = :cut AND dp.color = :color AND dp.clarity = :clarity")
    DiamondPrice findByCaratAndCutAndColorAndClarity(@Param("carat") double carat, @Param("cut") String cut, @Param("color") String color, @Param("clarity") String clarity);

}
