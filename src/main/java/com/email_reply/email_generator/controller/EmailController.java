package com.email_reply.email_generator.controller;

import com.email_reply.email_generator.dto.EmailRequest;
import com.email_reply.email_generator.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest)
    {
        return ResponseEntity
                .ok(emailService.generateEmail(emailRequest));
    }
}
