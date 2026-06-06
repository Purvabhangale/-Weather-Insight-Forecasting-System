package com.weather.repository;

import com.weather.model.AirQualityHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AirQualityHistoryRepository extends JpaRepository<AirQualityHistory, Long> {
    List<AirQualityHistory> findByUserIdOrderByCheckedAtDesc(Long userId);
}