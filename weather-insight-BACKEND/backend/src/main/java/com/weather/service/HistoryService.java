package com.weather.service;

import com.weather.model.SearchHistory;
import com.weather.model.User;
import com.weather.repository.SearchHistoryRepository;
import com.weather.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    private final SearchHistoryRepository historyRepo;
    private final UserRepository userRepo;

    public HistoryService(SearchHistoryRepository historyRepo, UserRepository userRepo) {
        this.historyRepo = historyRepo;
        this.userRepo = userRepo;
    }

    private User getUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Map<String, Object>> getHistory(String email) {
        return historyRepo.findByUserOrderBySearchedAtDesc(getUser(email))
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Object> addHistory(String email, String city) {
        User user = getUser(email);

        historyRepo.findByUserOrderBySearchedAtDesc(user).stream()
                .filter(h -> h.getCity().equalsIgnoreCase(city))
                .forEach(historyRepo::delete);

        SearchHistory history = new SearchHistory();
        history.setUser(user);
        history.setCity(city);

        SearchHistory saved = historyRepo.save(history);
        return toDTO(saved);
    }

    @Transactional
    public void clearHistory(String email) {
        historyRepo.deleteByUser(getUser(email));
    }

    private Map<String, Object> toDTO(SearchHistory h) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", h.getId());
        map.put("city", h.getCity());
        map.put("searchedAt", h.getSearchedAt() != null ? h.getSearchedAt().toString() : null);
        return map;
    }
}