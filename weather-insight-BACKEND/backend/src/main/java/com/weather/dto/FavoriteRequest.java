package com.weather.dto;

import jakarta.validation.constraints.NotBlank;

public class FavoriteRequest {

    @NotBlank
    private String city;

    public FavoriteRequest() {
    }

    public FavoriteRequest(String city) {
        this.city = city;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}