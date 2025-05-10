package com.young.selfblog.service;

import com.young.selfblog.dto.ContactDTO;

public interface ContactService {
    void processContactSubmission(ContactDTO contactDTO);
} 