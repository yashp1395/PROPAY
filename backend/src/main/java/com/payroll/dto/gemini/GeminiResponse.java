package com.payroll.dto.gemini;

import java.util.List;

public class GeminiResponse {
    
    private List<Candidate> candidates;
    
    public GeminiResponse() {}
    
    public List<Candidate> getCandidates() {
        return candidates;
    }
    
    public void setCandidates(List<Candidate> candidates) {
        this.candidates = candidates;
    }
    
    public static class Candidate {
        private Content content;
        private String finishReason;
        private Integer index;
        
        public Content getContent() {
            return content;
        }
        
        public void setContent(Content content) {
            this.content = content;
        }
        
        public String getFinishReason() {
            return finishReason;
        }
        
        public void setFinishReason(String finishReason) {
            this.finishReason = finishReason;
        }
        
        public Integer getIndex() {
            return index;
        }
        
        public void setIndex(Integer index) {
            this.index = index;
        }
    }
    
    public static class Content {
        private List<Part> parts;
        private String role;
        
        public List<Part> getParts() {
            return parts;
        }
        
        public void setParts(List<Part> parts) {
            this.parts = parts;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
    }
    
    public static class Part {
        private String text;
        
        public String getText() {
            return text;
        }
        
        public void setText(String text) {
            this.text = text;
        }
    }
}