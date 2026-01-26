// Mock data for Indian agricultural market
export const products = [
  { id: 'onion', name: 'Onion', icon: '🧅', category: 'vegetable' },
  { id: 'potato', name: 'Potato', icon: '🥔', category: 'vegetable' },
  { id: 'tomato', name: 'Tomato', icon: '🍅', category: 'vegetable' },
  { id: 'wheat', name: 'Wheat', icon: '🌾', category: 'grain' },
  { id: 'rice', name: 'Rice', icon: '🍚', category: 'grain' },
  { id: 'carrot', name: 'Carrot', icon: '🥕', category: 'vegetable' },
  { id: 'cabbage', name: 'Cabbage', icon: '🥬', category: 'vegetable' },
  { id: 'cauliflower', name: 'Cauliflower', icon: '🥦', category: 'vegetable' },
  { id: 'spinach', name: 'Spinach', icon: '🥬', category: 'leafy' },
  { id: 'okra', name: 'Okra', icon: '🌶️', category: 'vegetable' },
  { id: 'eggplant', name: 'Eggplant', icon: '🍆', category: 'vegetable' },
  { id: 'cucumber', name: 'Cucumber', icon: '🥒', category: 'vegetable' },
  { id: 'peas', name: 'Green Peas', icon: '🟢', category: 'vegetable' },
  { id: 'corn', name: 'Corn', icon: '🌽', category: 'grain' },
  { id: 'garlic', name: 'Garlic', icon: '🧄', category: 'spice' },
  { id: 'ginger', name: 'Ginger', icon: '🫚', category: 'spice' },
  { id: 'chili', name: 'Green Chili', icon: '🌶️', category: 'spice' },
  { id: 'lemon', name: 'Lemon', icon: '🍋', category: 'fruit' },
  { id: 'banana', name: 'Banana', icon: '🍌', category: 'fruit' },
  { id: 'apple', name: 'Apple', icon: '🍎', category: 'fruit' }
];

export const cities = [
  { id: 'delhi', name: 'Delhi', state: 'Delhi' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' }
];

// Generate realistic price data with seasonal variations
const generatePriceData = () => {
  const basePrice = {
    onion: { min: 15, max: 45, seasonal: 1.2 },
    potato: { min: 12, max: 35, seasonal: 0.8 },
    tomato: { min: 20, max: 60, seasonal: 1.5 },
    wheat: { min: 18, max: 25, seasonal: 0.3 },
    rice: { min: 35, max: 55, seasonal: 0.4 },
    carrot: { min: 25, max: 40, seasonal: 0.6 },
    cabbage: { min: 8, max: 20, seasonal: 0.7 },
    cauliflower: { min: 15, max: 35, seasonal: 1.0 },
    spinach: { min: 10, max: 25, seasonal: 0.9 },
    okra: { min: 30, max: 70, seasonal: 1.3 },
    eggplant: { min: 18, max: 35, seasonal: 0.8 },
    cucumber: { min: 12, max: 25, seasonal: 0.5 },
    peas: { min: 40, max: 80, seasonal: 1.4 },
    corn: { min: 15, max: 30, seasonal: 0.6 },
    garlic: { min: 80, max: 150, seasonal: 0.9 },
    ginger: { min: 60, max: 120, seasonal: 1.1 },
    chili: { min: 40, max: 100, seasonal: 1.2 },
    lemon: { min: 30, max: 60, seasonal: 0.8 },
    banana: { min: 20, max: 40, seasonal: 0.4 },
    apple: { min: 80, max: 150, seasonal: 0.7 }
  };

  const cityMultipliers = {
    delhi: 1.0,
    mumbai: 1.3,
    bangalore: 1.2,
    kolkata: 0.9,
    chennai: 1.1
  };

  const priceData = {};
  
  products.forEach(product => {
    priceData[product.id] = {};
    cities.forEach(city => {
      const base = basePrice[product.id];
      const multiplier = cityMultipliers[city.id];
      const seasonalVariation = Math.random() * base.seasonal;
      const currentPrice = Math.round((base.min + Math.random() * (base.max - base.min)) * multiplier * (1 + seasonalVariation));
      
      // Generate 7 days of historical data
      const historicalPrices = [];
      for (let i = 6; i >= 0; i--) {
        const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
        const price = Math.round(currentPrice * (1 + variation));
        historicalPrices.push({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: Math.max(price, base.min * multiplier * 0.8) // Minimum floor
        });
      }
      
      priceData[product.id][city.id] = {
        current: currentPrice,
        yesterday: historicalPrices[5].price,
        predicted: Math.round(currentPrice * (1 + (Math.random() - 0.5) * 0.15)), // ±7.5% prediction
        historical: historicalPrices,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
      };
    });
  });
  
  return priceData;
};

export const priceData = generatePriceData();

// Weather impact data
export const weatherImpacts = [
  {
    id: 1,
    product: 'tomato',
    impact: 'Heavy rain expected in Maharashtra - tomato prices may rise 15%',
    severity: 'high',
    icon: '🌧️'
  },
  {
    id: 2,
    product: 'onion',
    impact: 'Good weather in Karnataka - onion supply stable',
    severity: 'low',
    icon: '☀️'
  },
  {
    id: 3,
    product: 'wheat',
    impact: 'Harvest season in Punjab - wheat prices may drop 8%',
    severity: 'medium',
    icon: '🌾'
  }
];

// AI Assistant responses
export const aiResponses = {
  greeting: {
    en: "Namaste! I'm your AI assistant. I can help you with price negotiations, market trends, and fair trade advice. What would you like to know?",
    hi: "नमस्ते! मैं आपका AI सहायक हूं। मैं आपको भाव-ताव, बाजार के रुझान और निष्पक्ष व्यापार की सलाह में मदद कर सकता हूं। आप क्या जानना चाहते हैं?"
  },
  priceAdvice: {
    en: "Based on current market rates, I suggest selling {product} at ₹{price}/kg. This is {percentage}% above the average market price, giving you a good profit margin.",
    hi: "वर्तमान बाजार भाव के आधार पर, मैं सुझाता हूं कि {product} को ₹{price}/किग्रा पर बेचें। यह औसत बाजार भाव से {percentage}% अधिक है, जो आपको अच्छा मुनाफा देगा।"
  },
  negotiation: {
    en: "For negotiation, remember: 1) Know your minimum price, 2) Highlight quality, 3) Mention market trends, 4) Be willing to bundle products for better deals.",
    hi: "बातचीत के लिए याद रखें: 1) अपना न्यूनतम भाव जानें, 2) गुणवत्ता पर जोर दें, 3) बाजार के रुझान का जिक्र करें, 4) बेहतर सौदे के लिए उत्पादों को मिलाकर बेचने को तैयार रहें।"
  },
  weather: {
    en: "Weather can significantly impact prices. Rain affects transport and storage, leading to price increases. Plan your inventory accordingly.",
    hi: "मौसम का भाव पर काफी प्रभाव पड़ता है। बारिश से परिवहन और भंडारण प्रभावित होता है, जिससे भाव बढ़ जाता है। अपनी इन्वेंटरी की योजना उसी के अनुसार बनाएं।"
  }
};

// Fair trade scoring algorithm
export const calculateFairTradeScore = (sellingPrice, marketPrice, quality = 'good') => {
  const qualityMultiplier = {
    excellent: 1.2,
    good: 1.0,
    average: 0.9,
    poor: 0.8
  };
  
  const fairPrice = marketPrice * qualityMultiplier[quality];
  const priceRatio = sellingPrice / fairPrice;
  
  if (priceRatio >= 0.9 && priceRatio <= 1.1) return { score: 'green', text: 'Fair Deal' };
  if (priceRatio >= 0.8 && priceRatio <= 1.2) return { score: 'yellow', text: 'Acceptable' };
  return { score: 'red', text: 'Unfair' };
};