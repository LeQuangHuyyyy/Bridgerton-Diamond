package org.example.diamondshopsystem.services.exeptions;

public class NotEnoughProductsInStockException extends RuntimeException {
    public NotEnoughProductsInStockException(String message) {
        super(message);
    }
}