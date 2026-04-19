import logging
from apscheduler.schedulers.background import BackgroundScheduler
from services.weather_service import fetch_weather, check_severe_weather
from services.sms_service import send_weather_alert_sms
from database.base import SessionLocal
from database import models

logger = logging.getLogger(__name__)


def check_weather_anomalies():
    """
    Runs every hour. Fetches real-time weather for all unique user locations,
    checks for severe conditions, saves alerts to DB, and sends SMS if configured.
    """
    db = SessionLocal()
    try:
        # Get all unique locations from user inputs
        inputs = db.query(models.UserInput).all()
        seen_locations = set()

        for user_input in inputs:
            location = user_input.location.strip().lower()
            if location in seen_locations:
                continue
            seen_locations.add(location)

            # Fetch real weather
            weather = fetch_weather(user_input.location)
            severity_info = check_severe_weather(weather)

            if severity_info["is_severe"]:
                anomaly = severity_info["anomaly"]
                severity = severity_info["severity"]
                sms_msg = severity_info["sms_message"]

                # Append location to SMS
                full_sms = f"{sms_msg}\nLocation: {user_input.location} | Temp: {weather['temperature']}°C | Wind: {weather['wind_speed']}km/h"

                # Save alert to DB
                db_alert = models.Alert(
                    message=f"{anomaly} in {user_input.location} — Temp: {weather['temperature']}°C, Rain: {weather['rainfall']}mm, Wind: {weather['wind_speed']}km/h, Humidity: {weather['humidity']}%",
                    alert_type="Weather",
                    severity=severity
                )
                db.add(db_alert)
                db.commit()

                # Send SMS alert
                result = send_weather_alert_sms(full_sms, location=user_input.location)
                if result["sent"] > 0:
                    logger.info(f"SMS alert sent for {user_input.location}: {anomaly} ({result['sent']} recipients)")
                else:
                    logger.info(f"Weather alert saved for {user_input.location}: {anomaly} (SMS not configured)")

    except Exception as e:
        logger.error(f"Weather check job failed: {e}")
    finally:
        db.close()


def start_scheduler():
    scheduler = BackgroundScheduler()
    # Check weather every hour
    scheduler.add_job(check_weather_anomalies, 'interval', minutes=60, id='weather_check')
    # Also run once at startup after a short delay
    scheduler.add_job(check_weather_anomalies, 'interval', minutes=1, id='weather_check_startup',
                      max_instances=1, end_date=None)
    scheduler.start()
    logger.info("Weather monitoring scheduler started.")
