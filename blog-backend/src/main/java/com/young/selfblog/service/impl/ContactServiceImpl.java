package com.young.selfblog.service.impl;

import com.young.selfblog.dto.ContactDTO;
import com.young.selfblog.service.ContactService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ContactServiceImpl implements ContactService {
    
    private static final Logger logger = LoggerFactory.getLogger(ContactServiceImpl.class);
    
    @Override
    public void processContactSubmission(ContactDTO contactDTO) {
        // Log the contact submission
        logger.info("联系表单提交: 名称={}, 邮箱={}, 主题={}", 
                contactDTO.getName(), contactDTO.getEmail(), contactDTO.getSubject());
        
        // In a real application, you might:
        // 1. Save to database
        // 2. Send email notification
        // 3. Create a ticket in a CRM system
        
        // For simplicity, we're just logging the submission
    }
} 