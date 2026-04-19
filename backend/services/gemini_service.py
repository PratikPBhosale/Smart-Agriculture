import os
import json
from google import genai

_api_key = os.getenv("GEMINI_API_KEY", "")
_client = genai.Client(api_key=_api_key) if _api_key and _api_key != "your_gemini_api_key_here" else None

def generate_farming_plan(location_info: dict, weather_data: dict, soil_data: dict, top_crops: list, regional_context: dict = None):
    if not _client:
        # Detailed mock fallback
        return {
            "crop": top_crops[0] if top_crops else "Wheat",
            "total_days": 120,
            "phases": [
                {
                    "phase": "Land Preparation",
                    "week_range": "Week 1-2",
                    "days": [
                        {"day": 1, "tasks": ["Deep plowing to 20-25 cm depth", "Remove weeds and crop residues"], "notes": "Ensure soil is moist before plowing", "priority": "high"},
                        {"day": 2, "tasks": ["Secondary tillage / harrowing"], "notes": "Break large clods", "priority": "medium"},
                        {"day": 5, "tasks": ["Apply farmyard manure (10 tons/acre)", "Mix into soil"], "notes": "Use well-decomposed FYM only", "priority": "high"},
                        {"day": 7, "tasks": ["Soil testing for pH and nutrients", "Level the field"], "notes": "Target pH 6.0-7.0", "priority": "medium"},
                        {"day": 10, "tasks": ["Apply basal fertilizer (NPK 20:20:0)", "Final field leveling"], "notes": "Based on soil test results", "priority": "high"},
                        {"day": 14, "tasks": ["Prepare raised beds or furrows", "Install irrigation channels"], "notes": "Row spacing as per crop requirement", "priority": "high"},
                    ]
                },
                {
                    "phase": "Sowing",
                    "week_range": "Week 3",
                    "days": [
                        {"day": 15, "tasks": ["Seed treatment with fungicide", "Soak seeds for 8 hours"], "notes": "Use Thiram @ 2g/kg seed", "priority": "high"},
                        {"day": 16, "tasks": ["Sowing at recommended depth (3-4 cm)", "Maintain row-to-row spacing"], "notes": "Sow in morning hours", "priority": "high"},
                        {"day": 17, "tasks": ["Light irrigation after sowing (pre-emergence)"], "notes": "Do not over-irrigate", "priority": "high"},
                        {"day": 20, "tasks": ["Check germination rate", "Re-sow gaps if germination < 70%"], "notes": "Expected germination in 5-7 days", "priority": "medium"},
                    ]
                },
                {
                    "phase": "Vegetative Growth",
                    "week_range": "Week 4-8",
                    "days": [
                        {"day": 21, "tasks": ["First weeding manually or with herbicide"], "notes": "Critical period — weeds compete for nutrients", "priority": "high"},
                        {"day": 25, "tasks": ["Apply nitrogen top dressing (Urea 20 kg/acre)"], "notes": "Apply after irrigation", "priority": "high"},
                        {"day": 28, "tasks": ["Irrigation #2", "Scout for pests (aphids, stem borer)"], "notes": "Irrigate at field capacity", "priority": "medium"},
                        {"day": 35, "tasks": ["Second weeding", "Apply micronutrient spray (Zinc Sulphate)"], "notes": "Zinc deficiency shows as yellow stripes", "priority": "medium"},
                        {"day": 42, "tasks": ["Irrigation #3", "Apply second nitrogen dose"], "notes": "Monitor crop color — pale green = N deficiency", "priority": "high"},
                        {"day": 49, "tasks": ["Pest scouting — spray insecticide if threshold crossed", "Foliar spray of potassium"], "notes": "Use neem-based spray as first option", "priority": "medium"},
                        {"day": 56, "tasks": ["Irrigation #4", "Check for fungal disease symptoms"], "notes": "Look for rust, blight on leaves", "priority": "medium"},
                    ]
                },
                {
                    "phase": "Flowering & Fruiting",
                    "week_range": "Week 9-14",
                    "days": [
                        {"day": 60, "tasks": ["Irrigation #5 — critical flowering stage", "Stop all herbicide use"], "notes": "Water stress at flowering = yield loss", "priority": "high"},
                        {"day": 65, "tasks": ["Apply potassium fertilizer (MOP 10 kg/acre)"], "notes": "Improves grain/fruit quality", "priority": "high"},
                        {"day": 70, "tasks": ["Spray fungicide if disease pressure high", "Irrigation #6"], "notes": "Use Mancozeb or Carbendazim", "priority": "medium"},
                        {"day": 77, "tasks": ["Monitor pollination", "Remove diseased plants"], "notes": "Ensure bees are present for pollination", "priority": "medium"},
                        {"day": 84, "tasks": ["Irrigation #7", "Foliar spray of boron for fruit set"], "notes": "Boron improves fruit quality", "priority": "medium"},
                        {"day": 90, "tasks": ["Stop irrigation 2 weeks before harvest", "Final pest check"], "notes": "Dry conditions improve harvest quality", "priority": "high"},
                    ]
                },
                {
                    "phase": "Harvest & Post-Harvest",
                    "week_range": "Week 15-17",
                    "days": [
                        {"day": 100, "tasks": ["Check crop maturity indicators", "Arrange harvesting equipment/labor"], "notes": "Grain moisture should be 20-25% at harvest", "priority": "high"},
                        {"day": 105, "tasks": ["Harvest the crop", "Bundle and transport to threshing area"], "notes": "Harvest in dry weather only", "priority": "high"},
                        {"day": 108, "tasks": ["Threshing / separation of grain", "Winnowing to remove chaff"], "notes": "Avoid grain damage during threshing", "priority": "high"},
                        {"day": 110, "tasks": ["Sun-dry grain to 12-14% moisture", "Weigh and record yield"], "notes": "Proper drying prevents mold in storage", "priority": "high"},
                        {"day": 115, "tasks": ["Store in clean, dry bags", "Apply storage pesticide if needed"], "notes": "Use hermetic bags for long-term storage", "priority": "medium"},
                        {"day": 120, "tasks": ["Field cleanup — remove crop residues", "Plan next crop rotation"], "notes": "Incorporate residues as green manure", "priority": "low"},
                    ]
                }
            ],
            "alerts": [
                "Monitor weather forecast weekly and adjust irrigation schedule accordingly.",
                "Keep a field diary to record all inputs and observations.",
                "Contact local agricultural extension officer for region-specific advice."
            ]
        }

    prompt = f"""
You are an expert agronomist and AI Farming Assistant.
Generate a DETAILED, DAY-BY-DAY farming itinerary plan for the best crop from the list.

Location: {location_info}
Current Weather: {weather_data}
Soil Data (N={soil_data.get('N')}, P={soil_data.get('P')}, K={soil_data.get('K')}, pH={soil_data.get('pH')})
Top Recommended Crops: {top_crops}
"""

    # Inject Maharashtra regional context if available
    if regional_context and regional_context.get("region_notes"):
        prompt += f"""
Regional Context (Maharashtra):
- Region Notes: {regional_context.get('region_notes', '')}
"""
        if regional_context.get("best_season"):
            prompt += f"- Best Season: {regional_context.get('best_season')}\n"
        if regional_context.get("local_varieties"):
            prompt += f"- Local Varieties: {', '.join(regional_context.get('local_varieties', []))}\n"
        if regional_context.get("gi_tag"):
            prompt += f"- GI Tag: Yes — this crop has a Geographical Indication tag in this region. Mention this in the plan.\n"

    prompt += """
Select the BEST crop and generate a complete farming plan from Day 1 to harvest.
Group days into phases (Land Preparation, Sowing, Vegetative Growth, Flowering, Harvest).
Each phase must have a week_range (e.g. "Week 1-2") and multiple specific days.
Each day must have 2-4 specific actionable tasks, practical notes, and a priority.

Return ONLY valid JSON, no markdown, no extra text:
{
  "crop": "Best crop name",
  "total_days": <total days to harvest as integer>,
  "phases": [
    {
      "phase": "Phase Name",
      "week_range": "Week X-Y",
      "days": [
        {
          "day": <day number as integer>,
          "tasks": ["Specific task 1", "Specific task 2", "Specific task 3"],
          "notes": "Practical tip or warning for this day",
          "priority": "high/medium/low"
        }
      ]
    }
  ],
  "alerts": ["Important alert 1", "Important alert 2"]
}

Requirements:
- Include at least 5 phases
- Each phase must have at least 4-6 specific days
- Tasks must be very specific and actionable (quantities, methods, timings)
- Notes must be practical field-level advice
- Total days should reflect actual crop duration (e.g. wheat=120, rice=150, maize=90)
- If regional context is provided, incorporate local variety names and GI tag info into the plan
"""

    try:
        response = _client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        return data
    except Exception as e:
        return {
            "crop": top_crops[0] if top_crops else "Unknown",
            "total_days": 0,
            "phases": [],
            "alerts": [f"Failed to generate plan: {str(e)}"]
        }
