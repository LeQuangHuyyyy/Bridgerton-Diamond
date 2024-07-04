package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.Diamond;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface DiamondsRepository extends JpaRepository<Diamond, Integer> {

    @Query("SELECT d FROM Diamond d WHERE d.carat = :carat AND d.cut = :cut AND d.color = :color AND d.clarity = :clarity")
    List<Diamond> findAllByCaratAndCutAndColorAndClarity(@Param("carat") double carat, @Param("cut") String cut, @Param("color") String color, @Param("clarity") String clarity);

    @Query(value = "SELECT TOP 1 d.* FROM diamonds d WHERE d.status = 1 AND d.product_id = :productId ORDER BY d.diamond_id DESC", nativeQuery = true)
    Diamond findFirstAvailableDiamondByProductId(@Param("productId") Integer productId);

    @Query("SELECT d FROM Diamond d WHERE d.status = true AND d.product.productId = :productId ORDER BY d.diamondId DESC")
    List<Diamond> findDiamondsByProductId(@Param("productId") Integer productId);

    @Query("SELECT d FROM Diamond d WHERE d.product.productId = :productId")
    Set<Diamond> findByProductId(@Param("productId") int productId);

    @Query("SELECT d from Diamond d WHERE d.product is null")
    List<Diamond> findDiamondWithoutProducts();
}
