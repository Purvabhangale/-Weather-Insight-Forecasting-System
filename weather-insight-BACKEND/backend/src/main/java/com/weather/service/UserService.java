package com.weather.service;

import com.weather.model.User;
import com.weather.repository.FavoriteCityRepository;
import com.weather.repository.SearchHistoryRepository;
import com.weather.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final FavoriteCityRepository favoriteRepo;
    private final SearchHistoryRepository historyRepo;

    public UserService(UserRepository userRepo,
                       FavoriteCityRepository favoriteRepo,
                       SearchHistoryRepository historyRepo) {
        this.userRepo = userRepo;
        this.favoriteRepo = favoriteRepo;
        this.historyRepo = historyRepo;
    }

    public Map<String, Object> getProfile(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDTO(user);
    }

    public Map<String, Object> updateProfile(String email, String name, String newEmail) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(name);

        if (!newEmail.equals(email) && userRepo.existsByEmail(newEmail)) {
            throw new RuntimeException("Email already in use");
        }

        user.setEmail(newEmail);
        return toDTO(userRepo.save(user));
    }

    public List<Map<String, Object>> getAllUsers() {
        return userRepo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    public List<Map<String, Object>> getPopularCities() {
        return historyRepo.findPopularCities()
                .stream()
                .limit(10)
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("city", row[0].toString());
                    map.put("count", ((Number) row[1]).longValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepo.count());
        stats.put("totalSearches", historyRepo.count());
        stats.put("totalFavorites", favoriteRepo.count());
        return stats;
    }

    private Map<String, Object> toDTO(User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getId());
        dto.put("name", user.getName());
        dto.put("email", user.getEmail());
        dto.put("role", user.getRole().name());
        return dto;
    }
}