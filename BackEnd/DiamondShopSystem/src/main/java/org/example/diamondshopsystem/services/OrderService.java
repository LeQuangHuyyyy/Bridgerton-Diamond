package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.OrderDTO;
import org.example.diamondshopsystem.entities.*;

import org.example.diamondshopsystem.payload.requests.DiamondCategory;
import org.example.diamondshopsystem.payload.requests.OrderProductDetailRequest;
import org.example.diamondshopsystem.payload.requests.ProductCategory;
import org.example.diamondshopsystem.repositories.*;
import org.example.diamondshopsystem.services.Map.OrderMapper;
import org.example.diamondshopsystem.services.imp.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class OrderService implements OrderServiceImp {


    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderMapper orderMapper;


    @Autowired
    private UserRepository userRepository;
    private ProductRepository productRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Override
    public Page<OrderDTO> getAllOrder(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findAll(pageable);
        List<OrderDTO> orderDTOList = orderPage.getContent().stream().map(orderMapper::getAllOrder).collect(Collectors.toList());
        return new PageImpl<>(orderDTOList, pageable, orderPage.getTotalElements());
    }


    @Override
    public OrderDTO getOrderById(int orderId) {
        Optional<Order> Order = orderRepository.findById(orderId);
        if (Order.isPresent()) {
            Order order = Order.get();
            return orderMapper.mapOrderToOrderDTO(order);
        }
        return null;
    }

    public BigDecimal findPriceByOrderId(Integer orderId) {
        BigDecimal totalPrice = orderRepository.findTotalPriceByOrderId(orderId);
        return totalPrice;
    }

    @Override
    public void setOrderStatus(Integer orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if (isStatusTransitionAllowed(order.getStatus(), OrderStatus.PAYMENT)) {
            try {
                System.out.println("ccccc");
                order.setStatus(OrderStatus.PAYMENT);
                orderRepository.save(order);

            } catch (Exception e) {
                throw new IllegalStateException("cannot save");
            }
        } else {
            throw new IllegalStateException("Status transition from " + order.getStatus() + " to " + OrderStatus.PAYMENT + " is not allowed.");
        }
    }

    @Override
    public boolean setOrderStatusCancel(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if (isStatusTransitionAllowed(order.getStatus(), OrderStatus.CANCELED)) {
            try {
                order.setStatus(OrderStatus.CANCELED);
                orderRepository.save(order);
                return true;
            } catch (Exception e) {
                throw new IllegalStateException("cannot save");
            }
        } else {
            throw new IllegalStateException("Status transition from " + order.getStatus() + " to " + OrderStatus.PAYMENT + " is not allowed.");
        }
    }

    @Override
    public OrderStatus getOrderStatus(Integer orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        return order.getStatus();
    }

    @Override
    public Page<OrderDTO> getAllOrderByStatus(OrderStatus status, Pageable pageable) {
        try {
            Page<Order> orderPage = orderRepository.findByStatus(status, pageable);
            List<OrderDTO> orderDTOList = orderPage.getContent().stream().map(orderMapper::mapOrderToOrderDTO).collect(Collectors.toList());
            return new PageImpl<>(orderDTOList, pageable, orderPage.getTotalElements());
        } catch (Exception e) {
            e.getStackTrace();
            throw new RuntimeException("Failed to fetch orders by status");
        }
    }


    @Override
    public Page<OrderDTO> getAllOrdersByStatuses(List<OrderStatus> statuses, Pageable pageable) {
        try {
            Page<Order> orderPage = orderRepository.findByStatuses(statuses, pageable);
            List<OrderDTO> orderDTOList = orderPage.getContent().stream().map(orderMapper::mapOrderToOrderDTO).collect(Collectors.toList());
            return new PageImpl<>(orderDTOList, pageable, orderPage.getTotalElements());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch orders by statuses");
        }
    }

    @Override
    public void setOrderFromPaymentToDelivery(Integer orderId, String email) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        User saleStaff = userRepository.findByEmail(email);
        if (isStatusTransitionAllowed(order.getStatus(), OrderStatus.DELIVERED)) {
            order.setStatus(OrderStatus.DELIVERED);
            order.setSale(saleStaff);
            try {
                orderRepository.save(order);
            } catch (DataIntegrityViolationException e) {
                throw new IllegalStateException("Cannot update order status. The new status is not allowed.", e);
            }
        } else {
            throw new IllegalStateException("Status transition from " + order.getStatus() + " to " + OrderStatus.DELIVERED + " is not allowed.");
        }
    }

    @Override
    public List<OrderDTO> searchByKeyWord(String keyword, OrderStatus status) {
        List<Order> orders = orderRepository.findByKeyword(keyword, status);
        if (orders.isEmpty()) {
            orders = List.of(orderRepository.findById(Integer.parseInt(keyword)).orElseThrow(() -> new IllegalArgumentException("ke ke ke ")));
        }
        List<OrderDTO> orderDTOList = new ArrayList<>();
        for (Order o : orders) {

            orderDTOList.add(orderMapper.getAllOrder(o));
        }
        return orderDTOList;
    }

    public boolean isStatusTransitionAllowed(OrderStatus currentStatus, OrderStatus newStatus) {
        return switch (currentStatus) {
            case PENDING -> newStatus == OrderStatus.PAYMENT || newStatus == OrderStatus.CANCELED;
            case PAYMENT -> newStatus == OrderStatus.DELIVERED || newStatus == OrderStatus.CANCELED;
            case DELIVERED -> newStatus == OrderStatus.RECEIVED || newStatus == OrderStatus.CANCELED;
            case CANCELED, RECEIVED -> false;
        };
    }

    private static OrderProductDetailRequest getOrderProductDetailRequest(OrderDetails od) {
        OrderProductDetailRequest orderProductDetailRequests = new OrderProductDetailRequest();

        Products products = od.getProduct();
        String productName = products.getProductName();
        double price = products.getPrice();
        int quantity = od.getQuantity();
        orderProductDetailRequests.setProductName(productName);
        orderProductDetailRequests.setQuantity(quantity);
        orderProductDetailRequests.setPrice(price);
        orderProductDetailRequests.setSize(od.getSize());
        return orderProductDetailRequests;
    }

    public List<Order> orderListLastWeek() {
        List<Order> orders = orderRepository.findAll();
        List<Order> result = new ArrayList<>();

        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);

        calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        calendar.add(Calendar.WEEK_OF_YEAR, -1);
        Date startOfLastWeek = calendar.getTime();

        calendar.setTime(startOfLastWeek);
        calendar.add(Calendar.DAY_OF_WEEK, 6);
        Date endOfLastWeek = calendar.getTime();

        for (Order o : orders) {
            if (o.getOrderDate().after(startOfLastWeek) && o.getOrderDate().before(endOfLastWeek) && o.getStatus().equals(OrderStatus.PAYMENT)) {
                result.add(o);
            }
        }
        return result;
    }

    @Override
    public List<OrderDTO> getOrderSoldInLastWeek() {
        List<Order> orders = orderListLastWeek();
        List<OrderDTO> orderDTOS = new ArrayList<>();

        for (Order o : orders) {
            orderDTOS.add(orderMapper.getAllOrder(o));
        }
        return orderDTOS;
    }


    @Override
    public List<OrderProductDetailRequest> getTotalProductInLastWeek() {
        List<Order> orders = orderListLastWeek();
        List<OrderProductDetailRequest> list = new ArrayList<>();
        for (Order o : orders) {
            for (OrderDetails od : o.getOrderDetails()) {
                OrderProductDetailRequest orderProductDetailRequests = getOrderProductDetailRequest(od);
                list.add(orderProductDetailRequests);
            }
        }
        return list;
    }

    @Override
    public double revenueLastWeek() {
        List<Order> orders = orderListLastWeek();
        double price = 0;
        for (Order o : orders) {
            price += o.getOrderTotalAmount();
        }
        return price;
    }


    ///CT: price this week -  priceLastWeek / lastweek
    @Override
    public double getProfit() {
        List<Order> orderListLastWeek = orderListLastWeek();
        List<Order> orderThisWeek = orderRepository.findAll();

        double priceLastWeek = 0;
        double priceThisWeek = 0;

        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        Date startOfThisWeek = calendar.getTime();

        for (Order o : orderListLastWeek) {
            priceLastWeek += o.getOrderTotalAmount();
        }
        for (Order o : orderThisWeek) {
            if (o.getOrderDate().after(startOfThisWeek) && o.getOrderDate().before(now) && o.getStatus().equals(OrderStatus.PAYMENT)) {
                priceThisWeek += o.getOrderTotalAmount();
            }
        }

        double Profit = 0;
        Profit = (priceThisWeek - priceLastWeek) / priceLastWeek;

        DecimalFormat df = new DecimalFormat("#.##");
        double LatestProduct = Double.parseDouble(df.format(Profit));


        return LatestProduct * 100;
    }


    @Override
    public List<DiamondCategory> diamondSoldByCategory() {
        List<DiamondCategory> diamondCategories = new ArrayList<>();
        List<Order> orders = orderListLastWeek();
        List<String> days = new ArrayList<>();
        days.add("Mon");
        days.add("Tue");
        days.add("Wed");
        days.add("Thu");
        days.add("Fri");
        days.add("Sat");
        days.add("Sun");

        for (String day : days) {
            int heartQuantity = 0;
            int roundQuantity = 0;
            int ovalQuantity = 0;
            for (Order o : orders) {
                for (OrderDetails od : o.getOrderDetails()) {
                    LocalDateTime localDateTime = LocalDateTime.ofInstant(o.getOrderDate().toInstant(), ZoneId.systemDefault());
                    DayOfWeek dayOfWeek = localDateTime.getDayOfWeek();
                    if (dayOfWeek.toString().substring(0, 3).equalsIgnoreCase(day)) {
                        Products p = od.getProduct();
                        Set<Diamond> diamonds = p.getDiamonds();
                        for (Diamond d : diamonds) {
                            switch (d.getCut().toLowerCase()) {
                                case "heart":
                                    heartQuantity++;
                                    break;
                                case "round":
                                    roundQuantity++;
                                    break;
                                case "oval":
                                    ovalQuantity++;
                                    break;
                            }
                        }
                    }
                }
            }
            DiamondCategory dc = new DiamondCategory();
            dc.setDate(day);
            dc.setHeart(heartQuantity);
            dc.setRound(roundQuantity);
            dc.setOval(ovalQuantity);
            diamondCategories.add(dc);
        }
        return diamondCategories;
    }

    @Override
    public List<ProductCategory> getProductSoldByCategory() {
        int EngagementRings = 0;
        int WeddingBands = 0;
        int MenDiamondRing = 0;
        int WomenDiamondRing = 0;
        int DiamondNecklaces = 0;
        int DiamondEarrings = 0;
        int DiamondBracelets = 0;

        List<Order> orders = orderListLastWeek();
        ProductCategory productCategory = new ProductCategory();
        for (Order o : orders) {
            for (OrderDetails od : o.getOrderDetails()) {
                Products products = od.getProduct();
                Category category = products.getCategory();

                switch (category.getCategoryName()) {
                    case "Engagement Rings":
                        EngagementRings++;
                        break;
                    case "Wedding Bands":
                        WeddingBands++;
                        break;
                    case "Men diamond ring":
                        MenDiamondRing++;
                        break;
                    case "Women diamond ring":
                        WomenDiamondRing++;
                        break;
                    case "Diamond Necklaces":
                        DiamondNecklaces++;
                        break;
                    case "Diamond Earrings":
                        DiamondEarrings++;
                        break;
                    case "Diamond Bracelets":
                        DiamondBracelets++;
                        break;

                }
            }
        }
        List<ProductCategory> productCategories = new ArrayList<>();

        ProductCategory productCategory1 = new ProductCategory();
        productCategory1.setName("Engagement Rings");
        productCategory1.setQuantity(EngagementRings);

        ProductCategory productCategory2 = new ProductCategory();
        productCategory2.setName("Wedding Bands");
        productCategory2.setQuantity(WeddingBands);

        ProductCategory productCategory3 = new ProductCategory();
        productCategory3.setName("Men diamond ring");
        productCategory3.setQuantity(MenDiamondRing);

        ProductCategory productCategory4 = new ProductCategory();
        productCategory4.setName("Women diamond ring");
        productCategory4.setQuantity(WomenDiamondRing);

        ProductCategory productCategory5 = new ProductCategory();
        productCategory5.setName("Diamond Necklaces");
        productCategory5.setQuantity(DiamondNecklaces);

        ProductCategory productCategory6 = new ProductCategory();
        productCategory6.setName("Diamond Earrings");
        productCategory6.setQuantity(DiamondEarrings);

        ProductCategory productCategory7 = new ProductCategory();
        productCategory7.setName("Diamond Bracelets");
        productCategory7.setQuantity(DiamondBracelets);

        productCategories.add(productCategory1);
        productCategories.add(productCategory2);
        productCategories.add(productCategory3);
        productCategories.add(productCategory4);
        productCategories.add(productCategory5);
        productCategories.add(productCategory6);
        productCategories.add(productCategory7);

        return productCategories;
    }

    @Override
    public List<OrderDTO> getOrderByUserId(@RequestParam int userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        List<OrderDTO> orderDTOList = new ArrayList<>();
        for (Order o : orders) {
            orderDTOList.add(orderMapper.getAllOrder(o));
        }
        return orderDTOList;
    }

    @Override
    public List<OrderDetails> getDetailByOrderId(@RequestParam int orderId) {
        return orderDetailRepository.findByOrderId(orderId);
    }
}