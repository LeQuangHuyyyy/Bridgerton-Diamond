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
import org.springframework.boot.sql.init.dependency.DatabaseInitializationDependencyConfigurer;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
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
            order.setStatus(OrderStatus.PAYMENT);
            try {
                orderRepository.save(order);
            } catch (DataIntegrityViolationException e) {
                throw new IllegalStateException("Cannot update order status. The new status is not allowed.", e);
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


    private boolean isStatusTransitionAllowed(OrderStatus currentStatus, OrderStatus newStatus) {
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
            if (o.getOrderDate().after(startOfLastWeek) && o.getOrderDate().before(endOfLastWeek)) {
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


    @Override
    public List<DiamondCategory> diamondSoldByCategory() {
        List<Order> orders = orderListLastWeek();
        Map<String, DiamondCategory> diamondCategories = initializeDiamondCategoriesForWeek();

        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        calendar.add(Calendar.WEEK_OF_YEAR, -1);
        Date sundayStart = calendar.getTime();

        calendar.add(Calendar.DAY_OF_MONTH, 6);
        Date saturdayEnd = calendar.getTime();

        for (Order o : orders) {
            Date orderDate = o.getOrderDate();
            if (orderDate.after(sundayStart) && orderDate.before(saturdayEnd)) {
                updateDiamondCategories(o.getOrderDetails(), diamondCategories);
            }
        }

        return new ArrayList<>(diamondCategories.values());
    }


    private Map<String, DiamondCategory> initializeDiamondCategoriesForWeek() {
        Map<String, DiamondCategory> categories = new HashMap<>();

        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        calendar.add(Calendar.WEEK_OF_YEAR, -1);

        SimpleDateFormat sdf = new SimpleDateFormat("E");

        for (int i = 0; i < 7; i++) {
            Date date = calendar.getTime();
            String dayOfWeek = sdf.format(date);
            String[] shapes = {"Heart", "Oval", "Round"};

            for (String shape : shapes) {
                DiamondCategory category = new DiamondCategory();
                category.setSoldDate(date);
                category.setDiamondShape(shape);
                category.setShapeQuantity(0);
                categories.put(dayOfWeek + "_" + shape, category);
            }

            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }
        return categories;
    }

    private void updateDiamondCategories(List<OrderDetails> details, Map<String, DiamondCategory> categories) {
        SimpleDateFormat sdf = new SimpleDateFormat("E");


        for (OrderDetails od : details) {
            Products products = od.getProduct();
            Set<Diamond> diamonds = products.getDiamonds();
            Date date = od.getOrder().getOrderDate();
            String dayOfWeek = sdf.format(date);

            for (Diamond d : diamonds) {
                String cut = d.getCut();
                String key = dayOfWeek + "_" + cut;

                if (categories.containsKey(key)) {
                    DiamondCategory category = categories.get(key);
                    category.setShapeQuantity(category.getShapeQuantity() + 1);
                }
            }
        }
    }

    public ProductCategory getProductSoldByCategory() {
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
        productCategory.setEngagementRings(EngagementRings);
        productCategory.setWeddingBands(WeddingBands);
        productCategory.setMenDiamondRing(MenDiamondRing);
        productCategory.setWomenDiamondRing(WomenDiamondRing);
        productCategory.setDiamondNecklaces(DiamondNecklaces);
        productCategory.setDiamondEarrings(DiamondEarrings);
        productCategory.setDiamondBracelets(DiamondBracelets);

        return productCategory;
    }


}