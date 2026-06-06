package com.weather.repository;

import com.weather.model.FavoriteCity;
import com.weather.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteCityRepository extends JpaRepository<FavoriteCity, Long> {
    List<FavoriteCity> findByUserOrderByCreatedAtDesc(User user);
    Optional<FavoriteCity> findByUserAndCity(User user, String city);
    boolean existsByUserAndCity(User user, String city);
    long countByUser(User user);
}
