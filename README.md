# 🌾 AI Farming Assistant — Smart Agriculture Platform

An intelligent, full-stack farming assistant built for Maharashtra farmers. It combines Machine Learning, Generative AI, real-time weather monitoring, and SMS alerts to help farmers make data-driven decisions.

---

## 🚀 Features

### 🤖 AI-Powered Crop Recommendation
- Trained **Random Forest** model predicts the top 3 best crops based on soil parameters (N, P, K, pH) and real-time weather
- Confidence scores shown for each recommendation

### 🌾 Maharashtra Regional Crop Intelligence
- Built-in knowledge base covering **22 Maharashtra districts**
- Surfaces GI-tagged crops (Alphonso Mango, Nagpuri Orange, Jalgaon Banana, Sangli Turmeric, Poona Fig, Palghar Chikoo)
- Region-specific crop badges shown alongside ML recommendations
- Location autocomplete for all Maharashtra districts

### 📅 AI Farming Plan (Gemini 1.5 Flash)
- Generates a **detailed day-by-day farming itinerary** from Day 1 to harvest
- Organized into phases: Land Preparation → Sowing → Vegetative Growth → Flowering → Harvest
- Each day has specific actionable tasks, quantities, timings, and practical notes
- Maharashtra-aware: includes local variety names, GI tag info, and best seasons in the plan

### 🌦️ Real-Time Weather Monitoring
- **Live geocoding** via Open-Meteo API — fetches actual weather for any city (not hardcoded)
- Monitors: temperature, rainfall, humidity, wind speed, WMO weather condition
- Detects severe events: thunderstorms, heavy rainfall, extreme heat, strong winds, high humidity

### 📱 SMS Weather Alerts (Twilio)
- Automatic SMS alerts sent when severe weather is detected in a farmer's location
- Hourly background scheduler checks all registered locations
- Farmers can register their phone number directly from the Alerts page
- Powered by **Twilio SMS API**

### 🔬 Crop Disease Detection
- **CNN model** (trained on PlantVillage dataset — 38 disease classes)
- Upload a leaf image → get disease name, confidence score, and treatment recommendation
- Covers Apple, Corn, Grape, Tomato, Potato, Strawberry, and more

### 🧪 Fertilizer Recommendation
- **ANN model** trained to recommend optimal fertilizers based on soil and crop data

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Lucide Icons |
| Backend | FastAPI (Python) |
| Database | SQLite (via SQLAlchemy) |
| ML Models | Scikit-learn (Random Forest), TensorFlow/Keras (CNN, ANN) |
| AI Plan | Google Gemini 1.5 Flash |
| Weather | Open-Meteo API (free, no key needed) |
| SMS | Twilio SMS API |
| Scheduler | APScheduler (background jobs) |

---

## 📁 Project Structure

```
Smart-Agriculture/
├── backend/
│   ├── main.py                          # FastAPI app entry point
│   ├── requirements.txt                 # Python dependencies
│   ├── .env.example                     # Environment variables template
│   ├── database/
│   │   ├── base.py                      # SQLAlchemy engine & session
│   │   └── models.py                    # DB models (UserInput, FarmingPlan, Task, Alert)
│   ├── models/
│   │   ├── schemas.py                   # Pydantic request/response schemas
│   │   ├── crop_rf_model.pkl            # Trained Random Forest crop model
│   │   ├── Label_rf_model.pkl           # Label encoder for crop names
│   │   ├── best_cnn_phase1.h5           # Trained CNN disease detection model
│   │   └── ann_fertilizer_model.h5      # Trained ANN fertilizer model
│   ├── routes/
│   │   └── api.py                       # All API endpoints
│   ├── services/
│   │   ├── ml_service.py                # ML model inference (crop, disease, fertilizer)
│   │   ├── gemini_service.py            # Gemini AI farming plan generation
│   │   ├── weather_service.py           # Real-time weather + geocoding + severity check
│   │   ├── maharashtra_crop_service.py  # Maharashtra regional crop knowledge base
│   │   └── sms_service.py              # Twilio SMS alert service
│   └── scheduler/
│       └── jobs.py                      # Hourly weather monitoring job
├── frontend/
│   ├── src/
│   │   ├── App.jsx                      # Router + Navbar
│   │   ├── pages/
│   │   │   ├── InputPage.jsx            # Soil data + location input
│   │   │   ├── RecommendationPage.jsx   # ML crop recommendations + regional crops
│   │   │   ├── Dashboard.jsx            # Day-by-day farming plan itinerary
│   │   │   ├── DiseaseDetection.jsx     # Leaf image upload + CNN diagnosis
│   │   │   └── AlertsPage.jsx           # Live weather + SMS registration + alerts
│   │   └── index.css                    # Global dark theme styles
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/PratikPBhosale/Smart-Agriculture.git
cd Smart-Agriculture
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and fill in:
```env
GEMINI_API_KEY=your_gemini_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
ALERT_PHONE_NUMBERS=+919876543210
```

- **Gemini API key**: Get free at [aistudio.google.com](https://aistudio.google.com)
- **Twilio credentials**: Get free trial at [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
- **Weather API**: No key needed — uses free Open-Meteo API

### 4. Run the Backend
```bash
cd backend
uvicorn main:app --reload
```
Backend runs at `http://localhost:8000`  
API docs at `http://localhost:8000/docs`

### 5. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/input` | Save soil + location data |
| `GET` | `/recommend?input_id=1` | Get ML crop recommendations + regional crops |
| `POST` | `/generate-plan?input_id=1` | Generate AI day-by-day farming plan |
| `GET` | `/weather?location=Nashik` | Get real-time weather for any city |
| `POST` | `/disease-detect` | Upload leaf image for disease detection |
| `GET` | `/alerts` | Get all weather and AI alerts |
| `POST` | `/register-phone?phone=+91...` | Register phone for SMS alerts |
| `GET` | `/tasks` | Get all farming tasks |

---

## 🌍 Maharashtra Districts Supported

The regional crop intelligence covers all major Maharashtra districts:

| Region | Districts |
|--------|-----------|
| Konkan | Ratnagiri, Sindhudurg, Raigad, Palghar |
| Nashik Region | Nashik, Dhule, Jalgaon |
| Pune Region | Pune, Ahmednagar, Satara, Solapur, Sangli, Kolhapur |
| Vidarbha | Nagpur, Amravati, Wardha, Yavatmal, Akola |
| Marathwada | Chhatrapati Sambhajinagar, Latur, Nanded, Beed, Dharashiv |
| Mumbai | Mumbai, Thane, Palghar |

---

## 🏷️ GI-Tagged Crops Covered

| Crop | Region | GI Tag |
|------|--------|--------|
| Alphonso (Hapus) Mango | Ratnagiri, Sindhudurg | ✅ |
| Nagpuri Mandarin Orange | Nagpur, Amravati | ✅ |
| Jalgaon Banana | Jalgaon | ✅ |
| Sangli Turmeric | Sangli | ✅ |
| Poona Fig (Anjeer) | Pune (Purandar) | ✅ |
| Palghar Chikoo (Sapota) | Palghar (Dahanu) | ✅ |

---

## 📱 SMS Alert Triggers

Alerts are sent automatically when:
- 🌩️ **Thunderstorm** detected (WMO code 95/96/99)
- 🌧️ **Heavy rainfall** > 10mm/hr
- 🌡️ **Extreme heat** > 42°C
- 💨 **Strong winds** > 50 km/h
- 💧 **High humidity** > 90% (fungal disease risk)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

- **Pratik Bhosale** — [@PratikPBhosale](https://github.com/PratikPBhosale)

---

*Built with ❤️ for Maharashtra farmers*
