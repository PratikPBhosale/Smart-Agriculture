# ── Maharashtra Regional Crop Intelligence ────────────────────────────────────
# Static knowledge base mapping Maharashtra districts to their traditional crops,
# GI-tagged varieties, best seasons, and regional notes.

MAHARASHTRA_CROP_DB: dict = {
    "ratnagiri": {
        "district": "Ratnagiri",
        "region_label": "Konkan Region",
        "crops": ["Mango", "Jackfruit", "Kokum", "Cashew", "Rice", "Coconut"],
        "featured": {
            "mango": {"variety": "Alphonso (Hapus)", "gi_tag": True, "season": "March–June harvest"},
            "jackfruit": {"variety": "Local Konkan varieties", "gi_tag": False, "season": "April–June"},
            "kokum": {"variety": "Garcinia indica", "gi_tag": False, "season": "March–May"},
        },
        "region_notes": "Ratnagiri is world-famous for Alphonso (Hapus) mango with GI tag. The laterite soil and coastal climate produce the finest mangoes in India.",
    },
    "sindhudurg": {
        "district": "Sindhudurg",
        "region_label": "Konkan Region",
        "crops": ["Mango", "Cashew", "Kokum", "Jackfruit", "Rice", "Coconut"],
        "featured": {
            "mango": {"variety": "Alphonso (Hapus)", "gi_tag": True, "season": "March–June harvest"},
            "cashew": {"variety": "Konkan Cashew", "gi_tag": False, "season": "February–May"},
        },
        "region_notes": "Sindhudurg shares the Konkan coastal belt with Ratnagiri. Known for Alphonso mango, cashew, and kokum cultivation.",
    },
    "raigad": {
        "district": "Raigad",
        "region_label": "Konkan Region",
        "crops": ["Mango", "Jackfruit", "Rice", "Coconut", "Jamun"],
        "featured": {
            "mango": {"variety": "Alphonso, Kesar", "gi_tag": False, "season": "April–June"},
            "jackfruit": {"variety": "Local varieties", "gi_tag": False, "season": "April–July"},
        },
        "region_notes": "Raigad district in the Konkan region is known for mango, jackfruit, and rice cultivation along the coastal plains.",
    },
    "nashik": {
        "district": "Nashik",
        "region_label": "Nashik Region",
        "crops": ["Grapes", "Onion", "Banana", "Tomato", "Wheat", "Guava"],
        "featured": {
            "grapes": {"variety": "Thompson Seedless, Sharad Seedless, Flame Seedless", "gi_tag": False, "season": "October–November planting, February–March harvest"},
            "onion": {"variety": "Nashik Red Onion", "gi_tag": False, "season": "October–November sowing"},
        },
        "region_notes": "Nashik is India's largest grape and onion producing district. Known as the Wine Capital of India with over 50 wineries. Also a major banana and tomato hub.",
    },
    "sangli": {
        "district": "Sangli",
        "region_label": "Western Maharashtra",
        "crops": ["Grapes", "Sugarcane", "Turmeric", "Banana", "Soybean"],
        "featured": {
            "grapes": {"variety": "Thompson Seedless, Tas-A-Ganesh", "gi_tag": False, "season": "October–November planting"},
            "turmeric": {"variety": "Sangli Turmeric", "gi_tag": True, "season": "June–July sowing, January–March harvest"},
        },
        "region_notes": "Sangli is a major grape and turmeric producing district. Sangli turmeric has a GI tag and is exported worldwide. Also a significant sugarcane belt.",
    },
    "solapur": {
        "district": "Solapur",
        "region_label": "Eastern Maharashtra",
        "crops": ["Pomegranate", "Jowar", "Sugarcane", "Cotton", "Onion"],
        "featured": {
            "pomegranate": {"variety": "Bhagwa, Ganesh", "gi_tag": False, "season": "June–July planting, October–December harvest"},
        },
        "region_notes": "Solapur is one of India's largest pomegranate producing districts. The semi-arid climate is ideal for pomegranate cultivation. Also a major jowar and sugarcane region.",
    },
    "ahmednagar": {
        "district": "Ahmednagar",
        "region_label": "Western Maharashtra",
        "crops": ["Pomegranate", "Sugarcane", "Onion", "Wheat", "Jowar", "Guava"],
        "featured": {
            "pomegranate": {"variety": "Bhagwa (Bhagwan Nagar variety)", "gi_tag": False, "season": "June–July planting"},
            "sugarcane": {"variety": "Co-86032, Co-94012", "gi_tag": False, "season": "October–November planting"},
        },
        "region_notes": "Ahmednagar (Bhagwan Nagar) is a top pomegranate and sugarcane district. Rahata taluka is known for guava. Major onion and wheat production.",
    },
    "nagpur": {
        "district": "Nagpur",
        "region_label": "Vidarbha Region",
        "crops": ["Orange", "Cotton", "Soybean", "Wheat", "Rice"],
        "featured": {
            "orange": {"variety": "Nagpuri Mandarin (Santra)", "gi_tag": True, "season": "November–January harvest"},
        },
        "region_notes": "Nagpur is the Orange City of India. Nagpuri Mandarin (Santra) has a GI tag and is exported globally. Also a major cotton and soybean producing region.",
    },
    "amravati": {
        "district": "Amravati",
        "region_label": "Vidarbha Region",
        "crops": ["Orange", "Cotton", "Soybean", "Jowar", "Wheat"],
        "featured": {
            "orange": {"variety": "Nagpuri Mandarin", "gi_tag": True, "season": "November–January harvest"},
            "cotton": {"variety": "Bt Cotton, Desi Cotton", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Amravati is part of the Vidarbha orange belt and a major cotton producing district. Known for high-quality Nagpuri oranges.",
    },
    "satara": {
        "district": "Satara",
        "region_label": "Western Maharashtra",
        "crops": ["Strawberry", "Sugarcane", "Potato", "Tomato", "Mosambi"],
        "featured": {
            "strawberry": {"variety": "Camarosa, Sweet Charlie, Festival", "gi_tag": False, "season": "October–November planting, December–March harvest"},
        },
        "region_notes": "Satara district (Mahabaleshwar and Panchgani) is the Strawberry Capital of India. The cool climate at 1,300m elevation is perfect for strawberry cultivation.",
    },
    "pune": {
        "district": "Pune",
        "region_label": "Pune Region",
        "crops": ["Wheat", "Jowar", "Onion", "Tomato", "Guava", "Fig", "Sugarcane"],
        "featured": {
            "fig": {"variety": "Poona Fig (Anjeer)", "gi_tag": True, "season": "June–July planting, November–January harvest"},
            "guava": {"variety": "Allahabad Safeda, L-49", "gi_tag": False, "season": "Year-round with two seasons"},
        },
        "region_notes": "Pune district (Purandar, Saswad) is famous for GI-tagged Poona Fig (Anjeer). Also a major wheat, jowar, onion, and guava producing region.",
    },
    "kolhapur": {
        "district": "Kolhapur",
        "region_label": "Western Maharashtra",
        "crops": ["Sugarcane", "Turmeric", "Rice", "Soybean", "Groundnut"],
        "featured": {
            "sugarcane": {"variety": "Co-86032, Co-94012", "gi_tag": False, "season": "October–November planting"},
            "turmeric": {"variety": "Kolhapur Turmeric", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Kolhapur is Maharashtra's largest sugarcane and turmeric producing district. The fertile black soil and good rainfall make it ideal for sugarcane.",
    },
    "jalgaon": {
        "district": "Jalgaon",
        "region_label": "North Maharashtra",
        "crops": ["Banana", "Cotton", "Wheat", "Ber", "Soybean"],
        "featured": {
            "banana": {"variety": "Grand Naine (G9), Shrimanti", "gi_tag": True, "season": "Year-round; main planting June–July"},
        },
        "region_notes": "Jalgaon is the Banana City of India with GI-tagged Jalgaon Banana. Produces over 40% of Maharashtra's banana output. Also a major cotton district.",
    },
    "palghar": {
        "district": "Palghar",
        "region_label": "Konkan Region",
        "crops": ["Chikoo", "Rice", "Coconut", "Mango", "Ber"],
        "featured": {
            "chikoo": {"variety": "Kalipatti (Sapota)", "gi_tag": True, "season": "Year-round; peak October–December"},
        },
        "region_notes": "Palghar (Dahanu, Gholvad, Bordi) is India's largest chikoo (sapota) producing region with GI tag. The coastal climate is ideal for chikoo cultivation.",
    },
    "beed": {
        "district": "Beed",
        "region_label": "Marathwada Region",
        "crops": ["Custard Apple", "Cotton", "Soybean", "Jowar", "Sugarcane"],
        "featured": {
            "custard apple": {"variety": "Sitaphal (Local Marathwada variety)", "gi_tag": False, "season": "August–November harvest"},
        },
        "region_notes": "Beed district is the largest custard apple (Sitaphal) producing district in Maharashtra. The rocky terrain and climate are ideal for custard apple.",
    },
    "dhule": {
        "district": "Dhule",
        "region_label": "North Maharashtra",
        "crops": ["Pomegranate", "Bajra", "Soybean", "Cotton", "Wheat"],
        "featured": {
            "pomegranate": {"variety": "Bhagwa, Ganesh", "gi_tag": False, "season": "June–July planting"},
            "bajra": {"variety": "HHB-67, GHB-558", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Dhule is a major pomegranate and bajra (pearl millet) producing district in North Maharashtra.",
    },
    "latur": {
        "district": "Latur",
        "region_label": "Marathwada Region",
        "crops": ["Soybean", "Tur (Pigeon Pea)", "Cotton", "Jowar", "Wheat"],
        "featured": {
            "soybean": {"variety": "JS-335, MAUS-71", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Latur is a major soybean and tur (pigeon pea) producing district in Marathwada. Known as the soybean hub of Maharashtra.",
    },
    "nanded": {
        "district": "Nanded",
        "region_label": "Marathwada Region",
        "crops": ["Soybean", "Cotton", "Jowar", "Sugarcane", "Turmeric"],
        "featured": {
            "soybean": {"variety": "JS-335, MAUS-71", "gi_tag": False, "season": "June–July sowing"},
            "cotton": {"variety": "Bt Cotton", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Nanded is a major soybean and cotton producing district in Marathwada region.",
    },
    "wardha": {
        "district": "Wardha",
        "region_label": "Vidarbha Region",
        "crops": ["Cotton", "Soybean", "Jowar", "Wheat", "Orange"],
        "featured": {
            "cotton": {"variety": "Bt Cotton, Desi Cotton", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Wardha is a major cotton producing district in Vidarbha. Known as the cotton belt of Maharashtra.",
    },
    "yavatmal": {
        "district": "Yavatmal",
        "region_label": "Vidarbha Region",
        "crops": ["Cotton", "Soybean", "Jowar", "Tur", "Orange"],
        "featured": {
            "cotton": {"variety": "Bt Cotton", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Yavatmal is one of Maharashtra's largest cotton producing districts in Vidarbha. Also known for soybean and tur cultivation.",
    },
    "akola": {
        "district": "Akola",
        "region_label": "Vidarbha Region",
        "crops": ["Cotton", "Soybean", "Jowar", "Wheat", "Sunflower"],
        "featured": {
            "cotton": {"variety": "Bt Cotton, AKH-081", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Akola is a major cotton and soybean district in Vidarbha. The Akola Cotton Research Station is a leading agricultural research center.",
    },
    "chhatrapati sambhajinagar": {
        "district": "Chhatrapati Sambhajinagar",
        "region_label": "Marathwada Region",
        "crops": ["Cotton", "Soybean", "Jowar", "Sugarcane", "Grapes"],
        "featured": {
            "cotton": {"variety": "Bt Cotton", "gi_tag": False, "season": "June–July sowing"},
            "grapes": {"variety": "Thompson Seedless", "gi_tag": False, "season": "October–November planting"},
        },
        "region_notes": "Chhatrapati Sambhajinagar (formerly Aurangabad) is the gateway to Marathwada. Major cotton, soybean, and emerging grape cultivation.",
    },
    "dharashiv": {
        "district": "Dharashiv",
        "region_label": "Marathwada Region",
        "crops": ["Soybean", "Tur", "Cotton", "Jowar", "Sunflower"],
        "featured": {
            "soybean": {"variety": "JS-335", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Dharashiv (formerly Osmanabad) is a major soybean and tur producing district in Marathwada.",
    },
    "mumbai": {
        "district": "Mumbai",
        "region_label": "Mumbai Metropolitan Region",
        "crops": ["Rice", "Coconut", "Vegetables"],
        "featured": {},
        "region_notes": "Mumbai and surrounding areas have limited agricultural land. Coastal areas support rice and coconut cultivation.",
    },
    "buldhana": {
        "district": "Buldhana",
        "region_label": "Vidarbha Region",
        "crops": ["Cotton", "Soybean", "Jowar", "Wheat", "Tur (Pigeon Pea)", "Sunflower", "Chickpea"],
        "featured": {
            "cotton": {"variety": "Bt Cotton, Desi Cotton", "gi_tag": False, "season": "June–July sowing, October–December harvest"},
            "soybean": {"variety": "JS-335, MAUS-71", "gi_tag": False, "season": "June–July sowing, October harvest"},
        },
        "region_notes": "Buldhana is a major cotton and soybean producing district in Vidarbha. The deep black cotton soil (regur) is ideal for cotton cultivation. Also known for jowar, tur, and chickpea production.",
    },
    "washim": {
        "district": "Washim",
        "region_label": "Vidarbha Region",
        "crops": ["Cotton", "Soybean", "Jowar", "Tur", "Wheat"],
        "featured": {
            "cotton": {"variety": "Bt Cotton", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Washim is a cotton and soybean district in Vidarbha with black cotton soil.",
    },
    "hingoli": {
        "district": "Hingoli",
        "region_label": "Marathwada Region",
        "crops": ["Soybean", "Cotton", "Jowar", "Tur", "Wheat"],
        "featured": {
            "soybean": {"variety": "JS-335", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Hingoli is a soybean and cotton producing district in Marathwada.",
    },
    "parbhani": {
        "district": "Parbhani",
        "region_label": "Marathwada Region",
        "crops": ["Cotton", "Soybean", "Jowar", "Tur", "Sugarcane"],
        "featured": {
            "cotton": {"variety": "Bt Cotton", "gi_tag": False, "season": "June–July sowing"},
        },
        "region_notes": "Parbhani is a cotton and soybean district in Marathwada. Also known for sugarcane cultivation.",
    },
    "jalna": {
        "district": "Jalna",
        "region_label": "Marathwada Region",
        "crops": ["Cotton", "Soybean", "Jowar", "Mosambi", "Pomegranate"],
        "featured": {
            "mosambi": {"variety": "Sweet Lime", "gi_tag": False, "season": "Year-round"},
        },
        "region_notes": "Jalna is known for cotton, soybean, and sweet lime (mosambi) cultivation in Marathwada.",
    },
}

# ── Location Aliases ──────────────────────────────────────────────────────────
# Maps alternate names, sub-district names, and old names to canonical district keys
LOCATION_ALIASES: dict = {
    # Old names → new names
    "aurangabad": "chhatrapati sambhajinagar",
    "osmanabad": "dharashiv",
    # Sub-districts → parent district
    "mahabaleshwar": "satara",
    "panchgani": "satara",
    "dahanu": "palghar",
    "gholvad": "palghar",
    "bordi": "palghar",
    "purandar": "pune",
    "saswad": "pune",
    "rahata": "ahmednagar",
    "bhagwan nagar": "solapur",
    # City variants
    "nagpur city": "nagpur",
    "greater mumbai": "mumbai",
    "navi mumbai": "mumbai",
    "new mumbai": "mumbai",
    "thane": "mumbai",
    # Common misspellings / alternate spellings
    "nasik": "nashik",
    "kolhapur city": "kolhapur",
    "pune city": "pune",
    "solapur city": "solapur",
    "jalgoan": "jalgaon",
    "ratnagiri city": "ratnagiri",
    "buldhana city": "buldhana",
    "buldana": "buldhana",
    "washim city": "washim",
}


def normalize_location(location: str) -> str:
    """
    Normalize a location string: lowercase, strip whitespace, resolve aliases.
    Idempotent: normalize_location(normalize_location(x)) == normalize_location(x)
    """
    normalized = location.strip().lower()
    # Resolve alias if present
    return LOCATION_ALIASES.get(normalized, normalized)


def get_regional_crops(location: str) -> dict:
    """
    Given a city/district name, return Maharashtra regional crop data.
    Always returns a dict with all four keys present.
    """
    key = normalize_location(location)
    data = MAHARASHTRA_CROP_DB.get(key)

    if data:
        return {
            "district": data["district"],
            "crops": data["crops"],
            "region_label": data["region_label"],
            "is_maharashtra": True,
        }

    return {
        "district": "",
        "crops": [],
        "region_label": "",
        "is_maharashtra": False,
    }


def get_regional_context(location: str, crop: str) -> dict:
    """
    Returns rich context for a specific crop in a specific location,
    used to enrich the Gemini farming plan prompt.
    """
    key = normalize_location(location)
    data = MAHARASHTRA_CROP_DB.get(key)

    if not data:
        return {
            "region_notes": "",
            "best_season": "",
            "local_varieties": [],
            "gi_tag": False,
        }

    region_notes = data.get("region_notes", "")
    featured = data.get("featured", {})

    # Case-insensitive crop lookup in featured
    crop_key = crop.strip().lower()
    crop_info = None
    for k, v in featured.items():
        if k.lower() == crop_key:
            crop_info = v
            break

    if crop_info:
        return {
            "region_notes": region_notes,
            "best_season": crop_info.get("season", ""),
            "local_varieties": [v.strip() for v in crop_info.get("variety", "").split(",")],
            "gi_tag": crop_info.get("gi_tag", False),
        }

    return {
        "region_notes": region_notes,
        "best_season": "",
        "local_varieties": [],
        "gi_tag": False,
    }


def merge_recommendations(ml_result: dict, regional_data: dict) -> dict:
    """
    Merges ML model output with regional crop intelligence.
    Preserves top_crops and scores exactly. Appends regional crops not in top 3.
    """
    top_crops = ml_result.get("top_crops", [])
    scores = ml_result.get("scores", [])

    top_crops_lower = {c.lower() for c in top_crops}

    regional_crops = []
    for crop in regional_data.get("crops", []):
        if crop.lower() not in top_crops_lower:
            regional_crops.append(crop)

    return {
        "top_crops": top_crops,
        "scores": scores,
        "regional_crops": regional_crops,
        "region_label": regional_data.get("region_label", ""),
        "district": regional_data.get("district", ""),
        "is_maharashtra": regional_data.get("is_maharashtra", False),
    }
