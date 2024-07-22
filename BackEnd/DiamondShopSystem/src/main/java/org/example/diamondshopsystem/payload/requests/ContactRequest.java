package org.example.diamondshopsystem.payload.requests;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactRequest {
    private String name;
    private String email;
    private String subject;
    private String message;
}
