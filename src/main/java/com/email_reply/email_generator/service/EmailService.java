package com.email_reply.email_generator.service;

import com.email_reply.email_generator.dto.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailService {

    private final WebClient webClient;

    @Value("${gemini.url}")
    private String geminiUrl;

    @Value("${gemini.key}")
    private String geminiKey;

    @Autowired
    public EmailService(WebClient webClient) {
        this.webClient = webClient;
    }

    public String generateEmail(EmailRequest emailRequest)
    {
        //build the prompt
        //make the requeste object
        String prompt = generatePrompt(emailRequest);
        Map<String , Object> request = Map.of(
                "contents" , new Object[]{
                        Map.of(
                                "parts" , new Object[]{
                                        Map.of(
                                                "text" , prompt
                                        )
                                }
                        )
                }
        );

        String response = webClient.post()
                .uri(geminiUrl)
                .header("Content-Type", "application/json")
                .header("X-goog-api-key", geminiKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return extractResponseContent(response);

    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        }catch (Exception e) {
            throw new RuntimeException("Error extracting response content", e);
        }
    }

    private String generatePrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following content:\nPlease don't generate any subject");
        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append(" with a tone of ").append(emailRequest.getTone()).append(".\n");
        } else {
            prompt.append(".\n");
        }
        prompt.append("Original Email :\n").append(emailRequest.getEmailContent()).append("\n");
        return prompt.toString();
    }


}
