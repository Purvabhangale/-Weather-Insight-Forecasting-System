package com.weather.dto;

import jakarta.validation.constraints.NotBlank;

public class HistoryRequest {

    @NotBlank
    private String city;

    public HistoryRequest() {
    }

    public HistoryRequest(String city) {
        this.city = city;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}