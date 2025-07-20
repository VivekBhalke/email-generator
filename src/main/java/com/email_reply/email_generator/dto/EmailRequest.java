package com.email_reply.email_generator.dto;


public class EmailRequest {
    private String emailContent;
    private String tone;

    public String getEmailContent() {
        return emailContent;
    }

    public String getTone() {
        return tone;
    }

    public void setEmailContent(String emailContent) {
        this.emailContent = emailContent;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }


}
