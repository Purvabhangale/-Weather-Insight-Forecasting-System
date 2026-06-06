package com.weather.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String city;

    @Column(name = "searched_at", updatable = false)
    private LocalDateTime searchedAt;

    public SearchHistory() {
    }

    public SearchHistory(Long id, User user, String city, LocalDateTime searchedAt) {
        this.id = id;
        this.user = user;
        this.city = city;
        this.searchedAt = searchedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.searchedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocalDateTime getSearchedAt() {
        return searchedAt;
    }
}