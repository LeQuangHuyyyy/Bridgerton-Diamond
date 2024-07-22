package org.example.diamondshopsystem.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "warranties")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Warranties {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warranty_id")
    private int warrantiesId;

    @Column(name = "warranty_Code")
    private String warrantyCode;

    @Column(name = "warranty_start_date")
    private Date warrantyStartDate;

    @Column(name = "warranty_expiration_date")
    private Date warrantyExpirationDate;

    @OneToOne(mappedBy = "warranties", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private Order order;

    @OneToOne(mappedBy = "warranties", cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}, fetch = FetchType.EAGER)
    @JsonBackReference
    private Products product;
}
