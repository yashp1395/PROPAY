package com.payroll.dto.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class GeminiRequest {
    
    private List<Content> contents;
    
    @JsonProperty("generationConfig")
    private GenerationConfig generationConfig;
    
    public GeminiRequest() {}
    
    public GeminiRequest(List<Content> contents, GenerationConfig generationConfig) {
        this.contents = contents;
        this.generationConfig = generationConfig;
    }
    
    // Getters and Setters
    public List<Content> getContents() {
        return contents;
    }
    
    public void setContents(List<Content> contents) {
        this.contents = contents;
    }
    
    public GenerationConfig getGenerationConfig() {
        return generationConfig;
    }
    
    public void setGenerationConfig(GenerationConfig generationConfig) {
        this.generationConfig = generationConfig;
    }
    
    public static class Content {
        private List<Part> parts;
        
        public Content() {}
        
        public Content(List<Part> parts) {
            this.parts = parts;
        }
        
        public List<Part> getParts() {
            return parts;
        }
        
        public void setParts(List<Part> parts) {
            this.parts = parts;
        }
    }
    
    public static class Part {
        private String text;
        
        public Part() {}
        
        public Part(String text) {
            this.text = text;
        }
        
        public String getText() {
            return text;
        }
        
        public void setText(String text) {
            this.text = text;
        }
    }
    
    public static class GenerationConfig {
        private Double temperature;
        
        @JsonProperty("maxOutputTokens")
        private Integer maxOutputTokens;
        
        public GenerationConfig() {}
        
        public GenerationConfig(Double temperature, Integer maxOutputTokens) {
            this.temperature = temperature;
            this.maxOutputTokens = maxOutputTokens;
        }
        
        public Double getTemperature() {
            return temperature;
        }
        
        public void setTemperature(Double temperature) {
            this.temperature = temperature;
        }
        
        public Integer getMaxOutputTokens() {
            return maxOutputTokens;
        }
        
        public void setMaxOutputTokens(Integer maxOutputTokens) {
            this.maxOutputTokens = maxOutputTokens;
        }
    }
}