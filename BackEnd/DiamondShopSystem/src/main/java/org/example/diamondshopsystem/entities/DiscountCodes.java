package org.example.diamondshopsystem.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Objects;


@Entity
@Table(name = "discountCodes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class DiscountCodes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_id")
    private int codeId;

    @Column(name = "code")
    private String code;

    @Column(name = "discount_percenttage")
    private int discountPercentTage;

    @Column(name = "code_quantity")
    private int codeQuantity;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "promotion_id")
    @JsonBackReference
    private Promotions promotion;

    @OneToMany(
            mappedBy = "discountCode", fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}
    )
    @JsonBackReference
    private List<Order> orderList;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        DiscountCodes other = (DiscountCodes) obj;
        return codeId == other.codeId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(codeId);
    }
}
