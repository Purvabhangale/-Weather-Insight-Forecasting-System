package com.weather.controller;

import com.weather.service.HistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<?> getHistory(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(historyService.getHistory(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<?> addHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(
                    historyService.addHistory(userDetails.getUsername(), body.get("city"))
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> clearHistory(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            historyService.clearHistory(userDetails.getUsername());
            return ResponseEntity.ok(Map.of("message", "History cleared"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}