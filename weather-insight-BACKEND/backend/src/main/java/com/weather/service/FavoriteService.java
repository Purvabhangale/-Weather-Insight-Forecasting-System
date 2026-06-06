package com.weather.service;

import com.weather.model.FavoriteCity;
import com.weather.model.User;
import com.weather.repository.FavoriteCityRepository;
import com.weather.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteCityRepository favoriteRepo;
    private final UserRepository userRepo;

    public FavoriteService(FavoriteCityRepository favoriteRepo, UserRepository userRepo) {
        this.favoriteRepo = favoriteRepo;
        this.userRepo = userRepo;
    }

    private User getUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Map<String, Object>> getFavorites(String email) {
        return favoriteRepo.findByUserOrderByCreatedAtDesc(getUser(email))
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Object> addFavorite(String email, String city) {
        User user = getUser(email);

        if (favoriteRepo.existsByUserAndCity(user, city)) {
            throw new RuntimeException("Already in favorites");
        }

        FavoriteCity favorite = new FavoriteCity();
        favorite.setUser(user);
        favorite.setCity(city);

        FavoriteCity saved = favoriteRepo.save(favorite);
        return toDTO(saved);
    }

    public void removeFavorite(String email, Long id) {
        User user = getUser(email);

        FavoriteCity fav = favoriteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (!fav.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        favoriteRepo.delete(fav);
    }

    private Map<String, Object> toDTO(FavoriteCity fav) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", fav.getId());
        map.put("city", fav.getCity());
        map.put("createdAt", fav.getCreatedAt() != null ? fav.getCreatedAt().toString() : null);
        return map;
    }
}