import os
import json
from groq import Groq

_client = None

def _get_client():
    """Lazily initialize Groq client so dotenv is loaded first."""
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY", "")
        if api_key:
            _client = Groq(api_key=api_key)
    return _client


def _call_groq(messages: list, max_tokens: int = 2048, temperature: float = 0.7) -> str:
    """Make a Groq API call. Returns response text or raises."""
    client = _get_client()
    if not client:
        raise RuntimeError("Groq client not initialized — check GROQ_API_KEY in .env")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=max_tokens,
        temperature=temperature,
    )
    return response.choices[0].message.content.strip()


# ── Crop Validation for ANY Location ─────────────────────────────────────────

def validate_crops_for_location(ml_crops: list, location: str, soil: dict, weather: dict) -> dict:
    """
    Use Groq to validate and correct ML crop predictions based on actual
    geographic and agronomic knowledge of ANY location worldwide.
    Works for Jammu & Kashmir (apple), Kerala (coconut/rubber), Punjab (wheat),
    Maharashtra districts, or any other region.
    """
    client = _get_client()
    if not client or not location:
        return {"validated_crops": ml_crops, "corrections_made": False,
                "location_notes": "", "removed_crops": [], "added_crops": []}

    prompt = f"""You are a world-class agronomist with expert knowledge of crops grown in every region of India and the world.

A machine learning model predicted these crops based only on soil chemistry:
ML Predictions: {ml_crops}

Farmer's location: {location}
Soil data: N={soil.get('N')}, P={soil.get('P')}, K={soil.get('K')}, pH={soil.get('pH')}
Current weather: Temperature={weather.get('temperature')}°C, Rainfall={weather.get('rainfall')}mm/hr, Humidity={weather.get('humidity')}%

Your task — use your geographic and agronomic knowledge:
1. Identify what region/state/country "{location}" is in
2. Determine what crops are ACTUALLY and TRADITIONALLY grown in {location}
3. Check if the ML predictions match real crops grown there
4. Remove crops that are NOT grown in {location} (e.g. mango is not grown in Kashmir)
5. Add crops that ARE grown in {location} and match the soil/weather (e.g. apple for Kashmir, coconut for Kerala, wheat for Punjab, cotton for Vidarbha)
6. Return exactly 3 best crops for this location

Examples:
- Jammu & Kashmir → Apple, Saffron, Walnut, Cherry, Pear
- Kerala → Coconut, Rubber, Rice, Banana, Pepper, Cardamom
- Punjab → Wheat, Rice, Maize, Cotton, Sugarcane
- Himachal Pradesh → Apple, Potato, Wheat, Maize, Ginger
- Rajasthan → Bajra, Jowar, Wheat, Mustard, Groundnut
- Nashik Maharashtra → Grapes, Onion, Tomato, Wheat
- Buldhana Maharashtra → Cotton, Soybean, Jowar, Tur
- Nagpur Maharashtra → Orange, Cotton, Soybean

Return ONLY valid JSON, no markdown, no extra text:
{{
  "validated_crops": ["Crop1", "Crop2", "Crop3"],
  "corrections_made": true,
  "removed_crops": ["crop - reason"],
  "added_crops": ["crop - reason"],
  "location_notes": "One sentence about {location}'s agriculture and climate"
}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert agronomist with global crop knowledge. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=512,
            temperature=0.2,
        )
        text = response.choices[0].message.content.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        # Extract JSON if wrapped in other text
        if "{" in text:
            start = text.index("{")
            end = text.rindex("}") + 1
            text = text[start:end]
        result = json.loads(text)
        return result
    except Exception as e:
        return {"validated_crops": ml_crops, "corrections_made": False,
                "location_notes": "", "removed_crops": [], "added_crops": [], "error": str(e)}


# ── Farming Plan Generation ───────────────────────────────────────────────────

def generate_farming_plan(location_info: dict, weather_data: dict, soil_data: dict,
                           top_crops: list, regional_context: dict = None):
    """Generate a detailed day-by-day farming plan using Groq LLaMA."""

    client = _get_client()
    if not client:
        return _mock_farming_plan(top_crops)

    location = location_info.get("location", "India")

    system_msg = (
        f"You are an expert agronomist and AI Farming Assistant. "
        f"You generate detailed, practical, day-by-day farming plans specific to {location}. "
        "Return only valid JSON — no markdown, no code blocks, no extra text."
    )

    user_content = f"""Generate a DETAILED, DAY-BY-DAY farming itinerary for the best crop from this list.

Location: {location}
Current Weather: temperature={weather_data.get('temperature')}°C, rainfall={weather_data.get('rainfall')}mm, humidity={weather_data.get('humidity')}%
Soil: N={soil_data.get('N')}, P={soil_data.get('P')}, K={soil_data.get('K')}, pH={soil_data.get('pH')}
Top Recommended Crops: {top_crops}
"""

    if regional_context and regional_context.get("region_notes"):
        user_content += f"\nRegional Context:\n- {regional_context.get('region_notes')}"
        if regional_context.get("best_season"):
            user_content += f"\n- Best Season: {regional_context.get('best_season')}"
        if regional_context.get("local_varieties"):
            user_content += f"\n- Local Varieties: {', '.join(regional_context.get('local_varieties', []))}"
        if regional_context.get("gi_tag"):
            user_content += "\n- This crop has a GI tag in this region — mention it."

    user_content += """

Return ONLY this JSON structure, no markdown, no extra text:
{
  "crop": "Best crop name",
  "total_days": <integer>,
  "phases": [
    {
      "phase": "Phase Name",
      "week_range": "Week X-Y",
      "days": [
        {
          "day": <integer>,
          "tasks": ["Task 1", "Task 2", "Task 3"],
          "notes": "Practical tip",
          "priority": "high/medium/low"
        }
      ]
    }
  ],
  "alerts": ["Alert 1", "Alert 2"]
}

Requirements:
- At least 5 phases
- Each phase: 4-6 specific days with actionable tasks
- Tasks: specific quantities, methods, timings relevant to the location's climate
- total_days reflects actual crop duration (wheat=120, rice=150, maize=90, apple=365, grapes=180)
- Incorporate local variety names and GI tag if provided
"""

    try:
        text = _call_groq([
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_content}
        ], max_tokens=4096)

        text = text.replace("```json", "").replace("```", "").strip()
        if "{" in text:
            start = text.index("{")
            end = text.rindex("}") + 1
            text = text[start:end]
        return json.loads(text)

    except Exception as e:
        return {
            "crop": top_crops[0] if top_crops else "Unknown",
            "total_days": 0,
            "phases": [],
            "alerts": [f"Failed to generate plan: {str(e)}"]
        }


# ── Chatbot ───────────────────────────────────────────────────────────────────

def chat_with_assistant(message: str, history: list = None, context: dict = None) -> str:
    """Farming assistant chatbot powered by Groq LLaMA."""

    client = _get_client()
    if not client:
        return (
            "KrishiBot is not configured. Please add GROQ_API_KEY to backend/.env "
            "and restart the server."
        )

    system_content = """You are KrishiBot, an expert AI Farming Assistant with knowledge of agriculture across India and the world.
You help farmers with:
- Crop selection based on soil (N, P, K, pH), weather, and location
- Farming techniques, irrigation, fertilizer recommendations
- Plant disease identification and treatment
- Weather impact on crops and precautions
- Region-specific crops: Kashmir (Apple, Saffron), Kerala (Coconut, Rubber), Punjab (Wheat, Rice), Maharashtra (Grapes, Orange, Mango), Himachal (Apple, Potato)
- GI-tagged crops and their cultivation best practices
- Pest management using IPM (Integrated Pest Management)
- Organic farming and sustainable agriculture

Guidelines:
- Give practical, actionable advice specific to the farmer's location
- Use simple language a farmer can understand
- Include specific quantities, timings, and methods when relevant
- Keep responses concise but complete
- Respond in the same language the user writes in (Hindi, Marathi, English, or any regional language)
"""

    if context:
        location = context.get("location", "")
        if location:
            system_content += f"\nUser's location: {location}"
        n = context.get("N", "")
        if n:
            system_content += f"\nUser's soil: N={n}, P={context.get('P')}, K={context.get('K')}, pH={context.get('pH')}"

    messages = [{"role": "system", "content": system_content}]

    history = history or []
    for msg in history[-10:]:
        if hasattr(msg, 'role'):
            role_val, content_val = msg.role, msg.content
        else:
            role_val = msg.get("role", "user")
            content_val = msg.get("content", "")
        groq_role = "user" if role_val == "user" else "assistant"
        messages.append({"role": groq_role, "content": content_val})

    messages.append({"role": "user", "content": message})

    try:
        return _call_groq(messages, max_tokens=1024)
    except Exception as e:
        return f"Sorry, I couldn't process your question right now. Please try again. (Error: {str(e)})"


# ── Mock fallback ─────────────────────────────────────────────────────────────

def _mock_farming_plan(top_crops: list) -> dict:
    return {
        "crop": top_crops[0] if top_crops else "Wheat",
        "total_days": 120,
        "phases": [
            {
                "phase": "Land Preparation", "week_range": "Week 1-2",
                "days": [
                    {"day": 1, "tasks": ["Deep plowing to 20-25 cm", "Remove weeds"], "notes": "Ensure soil is moist", "priority": "high"},
                    {"day": 5, "tasks": ["Apply farmyard manure (10 tons/acre)"], "notes": "Use well-decomposed FYM", "priority": "high"},
                    {"day": 10, "tasks": ["Apply basal fertilizer NPK 20:20:0", "Final leveling"], "notes": "Based on soil test", "priority": "high"},
                    {"day": 14, "tasks": ["Prepare beds/furrows", "Install irrigation"], "notes": "Row spacing as per crop", "priority": "high"},
                ]
            },
            {
                "phase": "Sowing", "week_range": "Week 3",
                "days": [
                    {"day": 15, "tasks": ["Seed treatment with fungicide"], "notes": "Use Thiram @ 2g/kg", "priority": "high"},
                    {"day": 16, "tasks": ["Sowing at 3-4 cm depth"], "notes": "Sow in morning hours", "priority": "high"},
                    {"day": 20, "tasks": ["Check germination", "Re-sow gaps < 70%"], "notes": "Germination in 5-7 days", "priority": "medium"},
                ]
            },
            {
                "phase": "Vegetative Growth", "week_range": "Week 4-8",
                "days": [
                    {"day": 21, "tasks": ["First weeding"], "notes": "Critical — weeds compete for nutrients", "priority": "high"},
                    {"day": 28, "tasks": ["Irrigation #2", "Scout for pests"], "notes": "Irrigate at field capacity", "priority": "medium"},
                    {"day": 42, "tasks": ["Irrigation #3", "Second nitrogen dose"], "notes": "Monitor crop color", "priority": "high"},
                ]
            },
            {
                "phase": "Flowering", "week_range": "Week 9-12",
                "days": [
                    {"day": 60, "tasks": ["Irrigation #4 — critical stage"], "notes": "Water stress = yield loss", "priority": "high"},
                    {"day": 70, "tasks": ["Apply MOP 10 kg/acre"], "notes": "Improves grain quality", "priority": "high"},
                ]
            },
            {
                "phase": "Harvest", "week_range": "Week 15-17",
                "days": [
                    {"day": 105, "tasks": ["Harvest the crop"], "notes": "Harvest in dry weather", "priority": "high"},
                    {"day": 110, "tasks": ["Sun-dry to 12-14% moisture"], "notes": "Prevents mold in storage", "priority": "high"},
                    {"day": 120, "tasks": ["Store in clean dry bags", "Plan crop rotation"], "notes": "Use hermetic bags", "priority": "medium"},
                ]
            }
        ],
        "alerts": [
            "Monitor weather forecast weekly and adjust irrigation accordingly.",
            "Keep a field diary to record all inputs and observations."
        ]
    }
