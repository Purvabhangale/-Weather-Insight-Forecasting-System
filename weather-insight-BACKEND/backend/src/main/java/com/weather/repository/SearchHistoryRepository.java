package com.weather.repository;

import com.weather.model.SearchHistory;
import com.weather.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findByUserOrderBySearchedAtDesc(User user);
    void deleteByUser(User user);
    long countByUser(User user);
    @Query("SELECT s.city, COUNT(s) as cnt FROM SearchHistory s GROUP BY s.city ORDER BY cnt DESC")
    List<Object[]> findPopularCities();
}
