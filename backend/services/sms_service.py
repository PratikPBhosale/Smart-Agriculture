import os
import logging

logger = logging.getLogger(__name__)

# ── Twilio SMS Service ────────────────────────────────────────────────────────
# Sends SMS alerts for severe weather events.
# Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER in .env
# ALERT_PHONE_NUMBERS is a comma-separated list of numbers to notify.

def _get_twilio_client():
    """Lazily initialize Twilio client. Returns None if credentials missing."""
    account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")

    if not account_sid or not auth_token:
        return None

    try:
        from twilio.rest import Client
        return Client(account_sid, auth_token)
    except ImportError:
        logger.warning("twilio package not installed. Run: pip install twilio")
        return None
    except Exception as e:
        logger.warning(f"Twilio client init failed: {e}")
        return None


def send_weather_alert_sms(message: str, location: str = "") -> dict:
    """
    Send an SMS weather alert to all configured phone numbers.

    Args:
        message: The SMS body text
        location: Optional location name to include in logs

    Returns:
        {"sent": int, "failed": int, "sids": list[str]}
    """
    from_number = os.getenv("TWILIO_FROM_NUMBER", "")
    numbers_raw = os.getenv("ALERT_PHONE_NUMBERS", "")

    if not numbers_raw:
        logger.info("No ALERT_PHONE_NUMBERS configured — SMS not sent.")
        return {"sent": 0, "failed": 0, "sids": []}

    phone_numbers = [n.strip() for n in numbers_raw.split(",") if n.strip()]
    client = _get_twilio_client()

    if not client:
        logger.warning("Twilio not configured — SMS not sent.")
        return {"sent": 0, "failed": 0, "sids": []}

    sent = 0
    failed = 0
    sids = []

    for number in phone_numbers:
        try:
            msg = client.messages.create(
                body=message,
                from_=from_number,
                to=number
            )
            sids.append(msg.sid)
            sent += 1
            logger.info(f"SMS sent to {number} (SID: {msg.sid}) for location: {location}")
        except Exception as e:
            failed += 1
            logger.error(f"Failed to send SMS to {number}: {e}")

    return {"sent": sent, "failed": failed, "sids": sids}


def is_sms_configured() -> bool:
    """Check if Twilio SMS is properly configured."""
    return bool(
        os.getenv("TWILIO_ACCOUNT_SID") and
        os.getenv("TWILIO_AUTH_TOKEN") and
        os.getenv("TWILIO_FROM_NUMBER") and
        os.getenv("ALERT_PHONE_NUMBERS")
    )
