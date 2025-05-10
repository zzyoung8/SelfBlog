package com.young.selfblog.controller;

import com.young.selfblog.dto.ContactDTO;
import com.young.selfblog.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactService contactService;

    @Autowired
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<String> submitContactForm(@RequestBody ContactDTO contactDTO) {
        contactService.processContactSubmission(contactDTO);
        return ResponseEntity.ok("联系信息已成功提交");
    }
} 