package org.example.diamondshopsystem.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "[order]")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter


public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int orderId;

    @Column(name = "order_date")
    private Date orderDate;

    @Column(name = "order_total_amount")
    private double orderTotalAmount;

    @Column(name = "order_delivery_address")
    private String orderDeliveryAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;


    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "discountCode")
    @JsonBackReference
    private DiscountCodes discountCode;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "customerId")
    @JsonBackReference
    private User customer;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "saleId")
    @JsonBackReference
    private User sale;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "deliveryId")
    @JsonBackReference
    private User delivery;


    @OneToMany(
            mappedBy = "order", fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}
    )
    @JsonBackReference
    private List<FeedBack> feedBacks;

    @OneToMany(
            mappedBy = "order", fetch = FetchType.EAGER,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}
    )
    @JsonBackReference
    private List<OrderDetails> orderDetails;

    @OneToMany(
            mappedBy = "order", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL
    )
    @JsonBackReference
    private List<Warranties> warranties;

    @OneToMany(
            mappedBy = "order", fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}
    )
    @JsonBackReference
    private List<Invoice> invoices;

    @OneToMany(
            mappedBy = "order", fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}
    )
    @JsonBackReference
    private List<Payments> payments;
}
