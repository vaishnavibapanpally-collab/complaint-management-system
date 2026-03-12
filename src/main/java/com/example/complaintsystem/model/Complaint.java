package com.example.complaintsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String category;
    private String complaintText;
    private String priority;
    private String status;
    private String createdAt;
}