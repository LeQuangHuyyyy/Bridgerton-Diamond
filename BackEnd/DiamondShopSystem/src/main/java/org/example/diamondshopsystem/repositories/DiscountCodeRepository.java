package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.DiscountCodes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DiscountCodeRepository extends JpaRepository<DiscountCodes, Integer> {

    @Query("SELECT c FROM DiscountCodes c WHERE c.code LIKE %:code%")
    List<DiscountCodes> findAllByDiscountCode(@Param("code") String code);

    @Query("SELECT c FROM DiscountCodes c WHERE c.promotion.promotionId = :id")
    List<DiscountCodes> findAllByPromotionId(@Param("id") int id);

    @Query("SELECT c FROM DiscountCodes c WHERE c.code = :code AND c.codeQuantity > 0")
    DiscountCodes findByCode(@Param("code") String code);
}