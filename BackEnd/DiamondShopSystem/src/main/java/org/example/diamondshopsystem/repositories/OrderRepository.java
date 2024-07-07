package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomerName(String name);

    @Query("SELECT SUM(od.price) FROM OrderDetails od WHERE od.order.orderId = :orderId")
    BigDecimal getTotalAmountByOrderId(@Param("orderId") Integer orderId);


    @Query("SELECT o FROM Order o WHERE o.status = :status")
    Page<Order> findByStatus(@Param("status") OrderStatus status, Pageable pageable);

    // Query to find total price by orderId
    @Query("SELECT o.orderTotalAmount FROM Order o WHERE o.orderId = :orderId")
    BigDecimal findTotalPriceByOrderId(Integer orderId);

    @Query("SELECT o FROM Order o WHERE o.status IN :statuses")
    Page<Order> findByStatuses(@Param("statuses") List<OrderStatus> statuses, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE " +
            "o.customer.name LIKE %:keyword% OR " +
            "o.orderDeliveryAddress LIKE %:keyword% OR " +
            "STR(o.orderId) = :keyword OR " +
            "o.status = :status")
    List<Order> findByKeyword(@Param("keyword") String keyword, @Param("status") OrderStatus status);
}
