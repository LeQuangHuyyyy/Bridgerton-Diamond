package org.example.diamondshopsystem.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private int productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "price")
    private double price;

    @Column(name = "stock_quantity")
    private int stockQuantity;

    @Column(name = "[collection]")
    private String collection;

    @Column(name = "[description]", columnDefinition = "TEXT")
    private String description;

    @Column(name = "[image_1]")
    private String image1;

    @Column(name = "[image_2]")
    private String image2;

    @Column(name = "[image_3]")
    private String image3;

    @Column(name = "[image_4]")
    private String image4;

    @Column(name = "warranties_year")
    private double warrantiesYear;

    @Column(name = "warranties_image")
    private String imageWarranties;

    @Column(name = "certificate_image")
    private String imageCertificate;


    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "shell_id")
    @JsonBackReference
    private Shell shell;

    @OneToMany(mappedBy = "product", fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JsonBackReference
    private Set<Diamond> diamonds = new HashSet<>();

    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JsonBackReference
    @JoinColumn(name = "warranties_id")
    private Warranties warranties;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Products other = (Products) obj;
        return productId == other.productId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId);
    }

}
