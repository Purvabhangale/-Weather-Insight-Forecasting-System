package com.weather.controller;

import com.weather.model.AirQualityHistory;
import com.weather.model.User;
import com.weather.repository.AirQualityHistoryRepository;
import com.weather.repository.UserRepository;
import com.weather.config.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/air-quality")
@CrossOrigin(origins = "http://localhost:5173")
public class AirQualityController {

    private final AirQualityHistoryRepository airQualityHistoryRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AirQualityController(AirQualityHistoryRepository airQualityHistoryRepository,
                                UserRepository userRepository,
                                JwtUtil jwtUtil) {
        this.airQualityHistoryRepository = airQualityHistoryRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveAirQuality(@RequestBody Map<String, Object> body,
                                            HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("message", "Missing token"));
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }

            User user = optionalUser.get();

            AirQualityHistory history = new AirQualityHistory();
            history.setUserId(user.getId());
            history.setCity((String) body.get("city"));
            history.setAqi(((Number) body.get("aqi")).intValue());
            history.setCategory((String) body.get("category"));

            history.setPm25(body.get("pm25") != null ? ((Number) body.get("pm25")).doubleValue() : null);
            history.setPm10(body.get("pm10") != null ? ((Number) body.get("pm10")).doubleValue() : null);
            history.setCo(body.get("co") != null ? ((Number) body.get("co")).doubleValue() : null);
            history.setNo2(body.get("no2") != null ? ((Number) body.get("no2")).doubleValue() : null);
            history.setO3(body.get("o3") != null ? ((Number) body.get("o3")).doubleValue() : null);
            history.setSo2(body.get("so2") != null ? ((Number) body.get("so2")).doubleValue() : null);

            airQualityHistoryRepository.save(history);

            return ResponseEntity.ok(Map.of(
                    "message", "AQI data saved successfully",
                    "data", history
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Failed to save AQI data",
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getAirQualityHistory(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("message", "Missing token"));
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }

            User user = optionalUser.get();

            List<AirQualityHistory> historyList =
                    airQualityHistoryRepository.findByUserIdOrderByCheckedAtDesc(user.getId());

            return ResponseEntity.ok(historyList);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Failed to fetch AQI history",
                    "error", e.getMessage()
            ));
        }
    }
}
