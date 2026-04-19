export const translations = {
  en: {
    // Navbar
    appName: "AI Farming Assistant",
    navInput: "Input",
    navPlan: "Plan",
    navDisease: "Disease Detect",
    navAlerts: "Alerts",

    // InputPage
    heroTitle: "Smart Farming Starts Here",
    heroDesc: "Enter your soil metrics and location. Our AI will analyze environmental conditions, predict the best crops mathematically, and orchestrate a full farming lifecycle for maximum yield.",
    featureSoil: "Precision Soil Analytics",
    featureAI: "AI Generated Action Plans",
    featureWeather: "Real-Time Weather Integration",
    soilTitle: "Soil & Location Data",
    labelN: "Nitrogen (N)",
    labelP: "Phosphorus (P)",
    labelK: "Potassium (K)",
    labelPH: "Soil pH",
    labelLocation: "Location (City)",
    placeholderLocation: "e.g., Nashik, Srinagar, Shimla, Delhi",
    btnAnalyze: "Analyze Data",
    errorSave: "Failed to save data. Ensure backend is running.",

    // RecommendationPage
    aiRecommendations: "AI Crop Recommendations",
    basedOnSoil: "Based on your soil parameters and current weather conditions.",
    matchScore: "Match Score",
    btnGeneratePlan: "Generate Farming Plan",
    generating: "Generating...",
    errorPlan: "Failed to generate plan.",
    regionalTitle: "Specialty Crops",
    regionalDesc: "Crops traditionally grown in",
    regionalDistrict: "district — consider these alongside the ML recommendations.",

    // Dashboard
    farmingPlan: "Farming Plan",
    dayByDay: "Complete day-by-day itinerary",
    totalDays: "Total Days",
    phases: "Phases",
    activityDays: "Activity Days",
    importantAlerts: "Important Alerts",
    noPlan: "No Farming Plan Yet",
    noPlanDesc: "Go to the Input page, enter your soil data, and click \"Generate Farming Plan\".",
    tasksFor: "Tasks for Day",
    more: "more",

    // DiseaseDetection
    diseaseTitle: "Crop Disease Detection",
    diseaseDesc: "Upload a high-quality image of the affected plant leaf to run our CNN diagnostic model.",
    uploadPrompt: "Click to browse or drag and drop image here",
    btnAnalyzeAI: "Analyze with AI",
    analysisComplete: "Analysis Complete",
    detectedCondition: "Detected Condition",
    confidenceScore: "Confidence Score",
    recommendedTreatment: "Recommended Treatment",
    errorImage: "Failed to analyze image.",

    // AlertsPage
    liveWeather: "Live Weather Monitor",
    searchCity: "Search",
    temperature: "Temperature",
    rainfall: "Rainfall",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    smsTitle: "Register for SMS Weather Alerts",
    smsDesc: "Get instant SMS alerts when storms, heavy rainfall, or extreme heat are detected in your area.",
    smsNote: "Note: Add your Twilio credentials to backend/.env to enable SMS sending.",
    btnRegister: "Register",
    phonePlaceholder: "+91 9876543210",
    alertsTitle: "System Alerts & Notifications",
    noAlerts: "No active alerts. System is monitoring perfectly.",
    alertLabel: "Alert",
    enterCity: "Enter city...",

    // Priority labels
    high: "High",
    medium: "Medium",
    low: "Low",

    // ChatBot
    chatPlaceholder: "Ask about crops, diseases, weather...",
    chatTitle: "KrishiBot",
    chatSubtitle: "AI Farming Assistant",
  },

  hi: {
    // Navbar
    appName: "AI कृषि सहायक",
    navInput: "इनपुट",
    navPlan: "योजना",
    navDisease: "रोग पहचान",
    navAlerts: "अलर्ट",

    // InputPage
    heroTitle: "स्मार्ट खेती यहाँ से शुरू होती है",
    heroDesc: "अपनी मिट्टी की जानकारी और स्थान दर्ज करें। हमारा AI पर्यावरणीय परिस्थितियों का विश्लेषण करेगा, सर्वोत्तम फसलों की भविष्यवाणी करेगा और अधिकतम उपज के लिए पूरी खेती योजना तैयार करेगा।",
    featureSoil: "सटीक मिट्टी विश्लेषण",
    featureAI: "AI द्वारा तैयार कार्य योजना",
    featureWeather: "रियल-टाइम मौसम एकीकरण",
    soilTitle: "मिट्टी और स्थान की जानकारी",
    labelN: "नाइट्रोजन (N)",
    labelP: "फास्फोरस (P)",
    labelK: "पोटेशियम (K)",
    labelPH: "मिट्टी का pH",
    labelLocation: "स्थान (शहर)",
    placeholderLocation: "जैसे, नाशिक, श्रीनगर, शिमला, दिल्ली",
    btnAnalyze: "डेटा विश्लेषण करें",
    errorSave: "डेटा सहेजने में विफल। सुनिश्चित करें कि बैकएंड चल रहा है।",

    // RecommendationPage
    aiRecommendations: "AI फसल सिफारिशें",
    basedOnSoil: "आपकी मिट्टी के मापदंडों और वर्तमान मौसम की स्थिति के आधार पर।",
    matchScore: "मिलान स्कोर",
    btnGeneratePlan: "खेती योजना बनाएं",
    generating: "बन रही है...",
    errorPlan: "योजना बनाने में विफल।",
    regionalTitle: "विशेष फसलें",
    regionalDesc: "परंपरागत रूप से उगाई जाने वाली फसलें",
    regionalDistrict: "जिले में — ML सिफारिशों के साथ इन पर भी विचार करें।",

    // Dashboard
    farmingPlan: "खेती योजना",
    dayByDay: "दिन-प्रतिदिन की पूरी योजना",
    totalDays: "कुल दिन",
    phases: "चरण",
    activityDays: "गतिविधि दिन",
    importantAlerts: "महत्वपूर्ण अलर्ट",
    noPlan: "अभी तक कोई खेती योजना नहीं",
    noPlanDesc: "इनपुट पेज पर जाएं, मिट्टी का डेटा दर्ज करें और \"खेती योजना बनाएं\" पर क्लिक करें।",
    tasksFor: "दिन के कार्य",
    more: "और",

    // DiseaseDetection
    diseaseTitle: "फसल रोग पहचान",
    diseaseDesc: "हमारे CNN मॉडल से जांच के लिए प्रभावित पौधे की पत्ती की उच्च गुणवत्ता वाली छवि अपलोड करें।",
    uploadPrompt: "यहाँ क्लिक करें या छवि खींचकर छोड़ें",
    btnAnalyzeAI: "AI से विश्लेषण करें",
    analysisComplete: "विश्लेषण पूर्ण",
    detectedCondition: "पहचानी गई स्थिति",
    confidenceScore: "विश्वास स्कोर",
    recommendedTreatment: "अनुशंसित उपचार",
    errorImage: "छवि का विश्लेषण करने में विफल।",

    // AlertsPage
    liveWeather: "लाइव मौसम मॉनिटर",
    searchCity: "खोजें",
    temperature: "तापमान",
    rainfall: "वर्षा",
    humidity: "आर्द्रता",
    windSpeed: "हवा की गति",
    smsTitle: "SMS मौसम अलर्ट के लिए पंजीकरण करें",
    smsDesc: "जब आपके क्षेत्र में तूफान, भारी बारिश या अत्यधिक गर्मी का पता चले तो तुरंत SMS अलर्ट पाएं।",
    smsNote: "नोट: SMS भेजने के लिए backend/.env में Twilio क्रेडेंशियल जोड़ें।",
    btnRegister: "पंजीकरण करें",
    phonePlaceholder: "+91 9876543210",
    alertsTitle: "सिस्टम अलर्ट और सूचनाएं",
    noAlerts: "कोई सक्रिय अलर्ट नहीं। सिस्टम पूरी तरह से निगरानी कर रहा है।",
    alertLabel: "अलर्ट",
    enterCity: "शहर दर्ज करें...",

    // Priority labels
    high: "उच्च",
    medium: "मध्यम",
    low: "निम्न",

    // ChatBot
    chatPlaceholder: "फसल, रोग, मौसम के बारे में पूछें...",
    chatTitle: "कृषिबॉट",
    chatSubtitle: "AI कृषि सहायक",
  },

  mr: {
    // Navbar
    appName: "AI शेती सहाय्यक",
    navInput: "माहिती",
    navPlan: "योजना",
    navDisease: "रोग ओळख",
    navAlerts: "सूचना",

    // InputPage
    heroTitle: "स्मार्ट शेती इथून सुरू होते",
    heroDesc: "तुमच्या मातीची माहिती आणि स्थान प्रविष्ट करा. आमचे AI पर्यावरणीय परिस्थितींचे विश्लेषण करेल, सर्वोत्तम पिकांचा अंदाज लावेल आणि जास्तीत जास्त उत्पादनासाठी संपूर्ण शेती योजना तयार करेल.",
    featureSoil: "अचूक माती विश्लेषण",
    featureAI: "AI द्वारे तयार कृती योजना",
    featureWeather: "रिअल-टाइम हवामान एकत्रीकरण",
    soilTitle: "माती आणि स्थानाची माहिती",
    labelN: "नायट्रोजन (N)",
    labelP: "फॉस्फरस (P)",
    labelK: "पोटॅशियम (K)",
    labelPH: "मातीचा pH",
    labelLocation: "स्थान (शहर)",
    placeholderLocation: "उदा., नाशिक, श्रीनगर, शिमला, दिल्ली",
    btnAnalyze: "माहिती विश्लेषण करा",
    errorSave: "माहिती जतन करण्यात अयशस्वी. बॅकएंड चालू आहे याची खात्री करा.",

    // RecommendationPage
    aiRecommendations: "AI पीक शिफारसी",
    basedOnSoil: "तुमच्या मातीच्या मापदंडांवर आणि सध्याच्या हवामान परिस्थितीवर आधारित.",
    matchScore: "जुळणी गुण",
    btnGeneratePlan: "शेती योजना तयार करा",
    generating: "तयार होत आहे...",
    errorPlan: "योजना तयार करण्यात अयशस्वी.",
    regionalTitle: "विशेष पिके",
    regionalDesc: "पारंपारिकपणे पिकवली जाणारी पिके",
    regionalDistrict: "जिल्ह्यात — ML शिफारसींसोबत यांचाही विचार करा.",

    // Dashboard
    farmingPlan: "शेती योजना",
    dayByDay: "दिवसनिहाय संपूर्ण वेळापत्रक",
    totalDays: "एकूण दिवस",
    phases: "टप्पे",
    activityDays: "क्रियाकलाप दिवस",
    importantAlerts: "महत्त्वाच्या सूचना",
    noPlan: "अद्याप कोणतीही शेती योजना नाही",
    noPlanDesc: "माहिती पृष्ठावर जा, मातीचा डेटा प्रविष्ट करा आणि \"शेती योजना तयार करा\" वर क्लिक करा.",
    tasksFor: "दिवसाची कामे",
    more: "आणखी",

    // DiseaseDetection
    diseaseTitle: "पीक रोग ओळख",
    diseaseDesc: "आमच्या CNN मॉडेलने तपासणीसाठी प्रभावित वनस्पतीच्या पानाची उच्च दर्जाची प्रतिमा अपलोड करा.",
    uploadPrompt: "येथे क्लिक करा किंवा प्रतिमा ड्रॅग करा",
    btnAnalyzeAI: "AI ने विश्लेषण करा",
    analysisComplete: "विश्लेषण पूर्ण",
    detectedCondition: "ओळखलेली स्थिती",
    confidenceScore: "विश्वास गुण",
    recommendedTreatment: "शिफारस केलेले उपचार",
    errorImage: "प्रतिमेचे विश्लेषण करण्यात अयशस्वी.",

    // AlertsPage
    liveWeather: "थेट हवामान निरीक्षण",
    searchCity: "शोधा",
    temperature: "तापमान",
    rainfall: "पाऊस",
    humidity: "आर्द्रता",
    windSpeed: "वाऱ्याचा वेग",
    smsTitle: "SMS हवामान सूचनांसाठी नोंदणी करा",
    smsDesc: "तुमच्या परिसरात वादळ, जड पाऊस किंवा अत्यंत उष्णता आढळल्यास त्वरित SMS सूचना मिळवा.",
    smsNote: "टीप: SMS पाठवण्यासाठी backend/.env मध्ये Twilio क्रेडेन्शियल जोडा.",
    btnRegister: "नोंदणी करा",
    phonePlaceholder: "+91 9876543210",
    alertsTitle: "सिस्टम सूचना आणि अधिसूचना",
    noAlerts: "कोणत्याही सक्रिय सूचना नाहीत. सिस्टम परिपूर्णपणे निरीक्षण करत आहे.",
    alertLabel: "सूचना",
    enterCity: "शहर प्रविष्ट करा...",

    // Priority labels
    high: "उच्च",
    medium: "मध्यम",
    low: "कमी",

    // ChatBot
    chatPlaceholder: "पिके, रोग, हवामानाबद्दल विचारा...",
    chatTitle: "कृषीबॉट",
    chatSubtitle: "AI शेती सहाय्यक",
  }
};

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी',   flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी',   flag: '🟠' },
];
