import requests
import logging

logger = logging.getLogger(__name__)

# Pune fallback coordinates
PUNE_LAT, PUNE_LON = 18.5204, 73.8567


def geocode_location(location: str) -> tuple:
    """
    Resolve a city/district name to (lat, lon) using Open-Meteo geocoding API.
    Falls back to Pune coordinates on any failure — never raises.
    """
    try:
        response = requests.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={"name": location, "count": 1, "language": "en", "format": "json"},
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])
            if results:
                return (results[0]["latitude"], results[0]["longitude"])
        logger.warning(f"Geocoding returned no results for '{location}', using Pune fallback.")
    except Exception as e:
        logger.warning(f"Geocoding failed for '{location}': {e}. Using Pune fallback.")

    return (PUNE_LAT, PUNE_LON)


def fetch_weather(location: str) -> dict:
    """
    Fetch real-time weather for a location using Open-Meteo.
    Returns temperature (°C), rainfall (mm), humidity (%), wind_speed (km/h),
    weather_code (WMO code), and condition description.
    """
    lat, lon = geocode_location(location)

    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current_weather=true"
        f"&hourly=relativehumidity_2m,precipitation"
        f"&timezone=Asia%2FKolkata"
    )

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            current = data.get("current_weather", {})
            hourly = data.get("hourly", {})

            # Get current hour index for humidity and precipitation
            current_time = current.get("time", "")
            times = hourly.get("time", [])
            hour_idx = 0
            if current_time and times:
                try:
                    hour_idx = times.index(current_time)
                except ValueError:
                    hour_idx = 0

            humidity_list = hourly.get("relativehumidity_2m", [60])
            precip_list = hourly.get("precipitation", [0])

            humidity = humidity_list[hour_idx] if hour_idx < len(humidity_list) else 60
            rainfall = precip_list[hour_idx] if hour_idx < len(precip_list) else 0
            weather_code = current.get("weathercode", 0)

            return {
                "temperature": current.get("temperature", 25),
                "rainfall": round(float(rainfall), 2),
                "humidity": int(humidity),
                "wind_speed": current.get("windspeed", 0),
                "weather_code": weather_code,
                "condition": _weather_code_to_condition(weather_code),
                "lat": lat,
                "lon": lon,
            }
    except Exception as e:
        logger.warning(f"Weather fetch failed for '{location}': {e}")

    return {
        "temperature": 25,
        "rainfall": 0,
        "humidity": 60,
        "wind_speed": 0,
        "weather_code": 0,
        "condition": "Clear",
        "lat": lat,
        "lon": lon,
    }


def _weather_code_to_condition(code: int) -> str:
    """Convert WMO weather code to human-readable condition string."""
    if code == 0:
        return "Clear sky"
    elif code in (1, 2, 3):
        return "Partly cloudy"
    elif code in (45, 48):
        return "Foggy"
    elif code in (51, 53, 55):
        return "Drizzle"
    elif code in (61, 63, 65):
        return "Rain"
    elif code in (71, 73, 75):
        return "Snow"
    elif code in (80, 81, 82):
        return "Rain showers"
    elif code in (85, 86):
        return "Snow showers"
    elif code in (95,):
        return "Thunderstorm"
    elif code in (96, 99):
        return "Thunderstorm with hail"
    return "Unknown"


def check_severe_weather(weather: dict) -> dict:
    """
    Analyse weather data and return severity assessment.
    Returns: {"is_severe": bool, "severity": str, "anomaly": str, "sms_message": str}
    """
    temp = weather.get("temperature", 25)
    rainfall = weather.get("rainfall", 0)
    humidity = weather.get("humidity", 60)
    wind_speed = weather.get("wind_speed", 0)
    weather_code = weather.get("weather_code", 0)
    condition = weather.get("condition", "")

    # Thunderstorm
    if weather_code in (95, 96, 99):
        return {
            "is_severe": True,
            "severity": "High",
            "anomaly": f"Thunderstorm detected ({condition})",
            "sms_message": f"⚠️ WEATHER ALERT: Thunderstorm detected in your area! Secure your crops and equipment immediately. Avoid fieldwork. Stay safe.",
        }
    # Heavy rain
    if rainfall > 10 or weather_code in (65, 82):
        return {
            "is_severe": True,
            "severity": "High",
            "anomaly": f"Heavy Rainfall ({rainfall}mm/hr)",
            "sms_message": f"⚠️ WEATHER ALERT: Heavy rainfall ({rainfall}mm/hr) detected! Check drainage in your fields. Delay irrigation and spraying operations.",
        }
    # Moderate rain
    if rainfall > 5 or weather_code in (63, 81):
        return {
            "is_severe": True,
            "severity": "Medium",
            "anomaly": f"Moderate Rainfall ({rainfall}mm/hr)",
            "sms_message": f"🌧️ WEATHER UPDATE: Moderate rainfall ({rainfall}mm/hr) in your area. Postpone fertilizer application and field operations.",
        }
    # Extreme heat
    if temp > 42:
        return {
            "is_severe": True,
            "severity": "High",
            "anomaly": f"Extreme Heat ({temp}°C)",
            "sms_message": f"🌡️ WEATHER ALERT: Extreme heat ({temp}°C) detected! Irrigate crops early morning or evening. Protect seedlings from heat stress.",
        }
    # Heat stress
    if temp > 38:
        return {
            "is_severe": True,
            "severity": "Medium",
            "anomaly": f"Heat Stress ({temp}°C)",
            "sms_message": f"🌡️ WEATHER UPDATE: High temperature ({temp}°C) in your area. Increase irrigation frequency. Monitor crops for heat stress symptoms.",
        }
    # High wind
    if wind_speed > 50:
        return {
            "is_severe": True,
            "severity": "High",
            "anomaly": f"Strong Winds ({wind_speed}km/h)",
            "sms_message": f"💨 WEATHER ALERT: Strong winds ({wind_speed}km/h) detected! Secure tall crops and support structures. Avoid spraying operations.",
        }
    # High humidity (disease risk)
    if humidity > 90:
        return {
            "is_severe": True,
            "severity": "Medium",
            "anomaly": f"High Humidity ({humidity}%) — Disease Risk",
            "sms_message": f"💧 WEATHER UPDATE: Very high humidity ({humidity}%) detected. High risk of fungal diseases. Consider preventive fungicide spray.",
        }

    return {
        "is_severe": False,
        "severity": "Low",
        "anomaly": "None",
        "sms_message": "",
    }
