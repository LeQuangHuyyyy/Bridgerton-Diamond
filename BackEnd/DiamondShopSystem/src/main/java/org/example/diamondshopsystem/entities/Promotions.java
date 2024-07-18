package org.example.diamondshopsystem.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "promotions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class Promotions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int promotionId;

    @Column(name = "promotion_name")
    private String promotionName;

    @Column(name = "promotion_start_date")
    private Date promotionStartDate;

    @Column(name = "promotion_end_date")
    private Date promotionEndDate;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "manager_id")
    @JsonBackReference
    private User manager;


    @OneToMany(mappedBy = "promotion", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<DiscountCodes> discountCodes;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Promotions other = (Promotions) obj;
        return promotionId == other.promotionId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(promotionId);
    }
}
