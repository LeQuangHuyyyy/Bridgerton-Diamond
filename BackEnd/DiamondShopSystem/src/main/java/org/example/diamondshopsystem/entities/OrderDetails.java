package org.example.diamondshopsystem.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.diamondshopsystem.entities.key.KeyOrderDetail;

@Entity
@Table(name = "[order_details]")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class OrderDetails {



    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private double price;
    @EmbeddedId
    private KeyOrderDetail id;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @MapsId("orderId")
    @JoinColumn(name = "order_id")
    private Order order;


    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "size")
    private double size;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        OrderDetails other = (OrderDetails) obj;
        return id != null && id.equals(other.getId());
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

}
