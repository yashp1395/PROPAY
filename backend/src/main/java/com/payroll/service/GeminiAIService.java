package com.payroll.service;

import com.payroll.dto.gemini.GeminiRequest;
import com.payroll.dto.gemini.GeminiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class GeminiAIService {
    
    private static final Logger logger = LoggerFactory.getLogger(GeminiAIService.class);
    
    @Autowired
    private WebClient geminiWebClient;
    
    @Value("${gemini.model}")
    private String model;
    
    @Value("${gemini.max-tokens}")
    private Integer maxTokens;
    
    @Value("${gemini.temperature}")
    private Double temperature;
    
    public Mono<String> generateText(String prompt) {
        try {
            GeminiRequest request = createGeminiRequest(prompt);
            
            return geminiWebClient
                    .post()
                    .uri("/models/{model}:generateContent", model)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(GeminiResponse.class)
                    .map(this::extractTextFromResponse)
                    .doOnError(error -> logger.error("Error calling Gemini API: {}", error.getMessage()))
                    .onErrorReturn("Sorry, I'm unable to process your request at the moment.");
            
        } catch (Exception e) {
            logger.error("Error creating Gemini request: {}", e.getMessage());
            return Mono.just("Error processing your request.");
        }
    }
    
    public Mono<String> generateSalaryInsights(String employeeName, String salaryData) {
        String prompt = String.format(
            "Analyze the following salary data for employee %s and provide insights, recommendations, " +
            "and observations about their compensation structure. Focus on tax optimization, " +
            "allowances efficiency, and overall compensation strategy:\n\n%s\n\n" +
            "Please provide actionable insights in a professional format.",
            employeeName, salaryData
        );
        
        return generateText(prompt);
    }
    
    public Mono<String> generatePayrollReport(String payrollData) {
        String prompt = String.format(
            "Generate a comprehensive payroll analysis report based on the following data:\n\n%s\n\n" +
            "Please include:\n" +
            "1. Key financial metrics\n" +
            "2. Cost analysis\n" +
            "3. Trends and patterns\n" +
            "4. Recommendations for optimization\n" +
            "5. Compliance considerations\n\n" +
            "Format the response as a professional business report.",
            payrollData
        );
        
        return generateText(prompt);
    }
    
    public Mono<String> generateTaxAdvice(String salaryStructure) {
        String prompt = String.format(
            "Provide tax optimization advice for the following salary structure:\n\n%s\n\n" +
            "Please suggest:\n" +
            "1. Tax-efficient salary components\n" +
            "2. Deduction strategies\n" +
            "3. Investment recommendations\n" +
            "4. Compliance tips\n\n" +
            "Provide practical and legal tax optimization strategies.",
            salaryStructure
        );
        
        return generateText(prompt);
    }
    
    public Mono<String> generateCompensationBenchmark(String jobRole, String experience, String location) {
        String prompt = String.format(
            "Provide salary benchmarking information for:\n" +
            "Position: %s\n" +
            "Experience: %s years\n" +
            "Location: %s\n\n" +
            "Include:\n" +
            "1. Market salary ranges\n" +
            "2. Industry standards\n" +
            "3. Compensation components breakdown\n" +
            "4. Growth projections\n" +
            "5. Regional variations\n\n" +
            "Provide data-driven compensation insights.",
            jobRole, experience, location
        );
        
        return generateText(prompt);
    }
    
    public Mono<String> generatePerformanceBasedPayRecommendations(String performanceData) {
        String prompt = String.format(
            "Based on the following performance data, suggest performance-based compensation adjustments:\n\n%s\n\n" +
            "Provide recommendations for:\n" +
            "1. Merit increase percentages\n" +
            "2. Bonus structures\n" +
            "3. Incentive programs\n" +
            "4. Recognition rewards\n" +
            "5. Career development investments\n\n" +
            "Focus on fair, motivating, and budget-conscious recommendations.",
            performanceData
        );
        
        return generateText(prompt);
    }
    
    private GeminiRequest createGeminiRequest(String prompt) {
        GeminiRequest.Part part = new GeminiRequest.Part(prompt);
        GeminiRequest.Content content = new GeminiRequest.Content(List.of(part));
        GeminiRequest.GenerationConfig config = new GeminiRequest.GenerationConfig(temperature, maxTokens);
        
        return new GeminiRequest(List.of(content), config);
    }
    
    private String extractTextFromResponse(GeminiResponse response) {
        if (response != null && 
            response.getCandidates() != null && 
            !response.getCandidates().isEmpty() &&
            response.getCandidates().get(0).getContent() != null &&
            response.getCandidates().get(0).getContent().getParts() != null &&
            !response.getCandidates().get(0).getContent().getParts().isEmpty()) {
            
            return response.getCandidates().get(0)
                          .getContent()
                          .getParts()
                          .get(0)
                          .getText();
        }
        
        return "No response generated.";
    }
}