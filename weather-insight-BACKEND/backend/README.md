# Weather Insight Forecasting System — Backend

## STS madhe import ani run karayche steps

### Step 1 — MySQL Setup
1. MySQL Workbench open kara
2. `database/setup.sql` file run kara
3. `weather_insight_db` database tayar hotil

### Step 2 — Password set kara
`src/main/resources/application.properties` file open kara:
```
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```
apla MySQL password replace kara

### Step 3 — STS madhe import kara
```
File → Import → Maven → Existing Maven Projects
→ ha "weather-backend" folder select kara
→ Finish
```

### Step 4 — Run kara
```
WeatherInsightApplication.java → Right Click
→ Run As → Spring Boot App
```

Console madhe distil:
```
Started WeatherInsightApplication on port 8080
```

### Step 5 — Admin user login
```
Email:    admin@weather.com
Password: admin123
```

---

## API Endpoints

| Method | URL                        | Description        |
|--------|----------------------------|--------------------|
| POST   | /api/auth/register         | Register user      |
| POST   | /api/auth/login            | Login              |
| GET    | /api/user/profile          | Get profile        |
| PUT    | /api/user/profile          | Update profile     |
| GET    | /api/favorites             | Get favorites      |
| POST   | /api/favorites             | Add favorite       |
| DELETE | /api/favorites/{id}        | Remove favorite    |
| GET    | /api/history               | Get history        |
| POST   | /api/history               | Add history        |
| DELETE | /api/history               | Clear history      |
| GET    | /api/admin/users           | All users (admin)  |
| DELETE | /api/admin/users/{id}      | Delete user        |
| GET    | /api/admin/popular-cities  | Popular cities     |
| GET    | /api/admin/stats           | System stats       |

---

## Note about AQI
AQI (Air Quality Index) data is fetched directly from
OpenWeatherMap API in the React frontend.
No backend changes needed for AQI feature.
