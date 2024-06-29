package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.Promotions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotions, Integer>{

    @Query("SELECT p FROM Promotions p WHERE p.promotionName LIKE %:name%")
    List<Promotions> findAllByPromotionName(@Param("name") String name);

    @Query("SELECT p FROM Promotions p WHERE p.promotionStartDate >= :startDate AND p.promotionEndDate <= :endDate")
    List<Promotions> findPromotionsByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT p FROM Promotions p WHERE p.promotionName LIKE %:name% AND p.promotionStartDate >= :startDate AND p.promotionEndDate <= :endDate")
    List<Promotions> findPromotionsByDateRangeAndPromotionName(@Param("name") String name, @Param("startDate") Date startDate, @Param("endDate") Date endDate);
}