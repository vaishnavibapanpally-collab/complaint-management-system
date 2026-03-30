package com.example.complaintsystem.service;

import com.example.complaintsystem.model.Complaint;
import com.example.complaintsystem.repository.ComplaintRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository repo;

    public ComplaintService(ComplaintRepository repo) {
        this.repo = repo;
    }

    public Complaint submitComplaint(Complaint c) {
        c.setStatus("Pending");
        c.setCreatedAt(LocalDateTime.now().toString());
        return repo.save(c);
    }

    public List<Complaint> getAllComplaints() {
        return repo.findAll();
    }
    public Complaint getComplaintById(Long id) {
        return repo.findById(id).orElseThrow();
    }
    public Complaint updateStatus(Long id, String status) {
        Complaint c = repo.findById(id).orElseThrow();
        c.setStatus(status);
        return repo.save(c);
    }
}