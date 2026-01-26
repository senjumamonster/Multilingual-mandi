import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { products, priceData, cities, aiResponses, calculateFairTradeScore } from '../data/mockData';
import { Send, Mic, MicOff, Bot, User, Lightbulb, TrendingUp, Calculator } from 'lucide-react';
import './AIAssistant.css';

const AIAssistant = () => {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: aiResponses.greeting[currentLanguage] || aiResponses.greeting.en,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate voice input
  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const voiceInputs = [
          'What is the price of tomato in Delhi?',
          'टमाटर का भाव क्या है दिल्ली में?',
          'How should I negotiate for onions?',
          'मुझे प्याज के लिए कैसे बात करनी चाहिए?'
        ];
        const randomInput = voiceInputs[Math.floor(Math.random() * voiceInputs.length)];
        setInputMessage(randomInput);
        setIsListening(false);
      }, 2000);
    }
  };

  // AI Response Generator
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Price inquiry
    if (message.includes('price') || message.includes('भाव') || message.includes('cost')) {
      const product = products.find(p => 
        message.includes(p.name.toLowerCase()) || 
        message.includes(t(p.id).toLowerCase())
      );
      const city = cities.find(c => 
        message.includes(c.name.toLowerCase()) || 
        message.includes(t(c.id).toLowerCase())
      );
      
      if (product && city) {
        const price = priceData[product.id][city.id].current;
        const predicted = priceData[product.id][city.id].predicted;
        const change = predicted - price;
        const percentage = ((change / price) * 100).toFixed(1);
        
        return {
          type: 'price-info',
          content: `Current price of ${t(product.id)} in ${t(city.id)} is ₹${price}/kg. Tomorrow's predicted price is ₹${predicted}/kg (${change >= 0 ? '+' : ''}${percentage}% change).`,
          data: { product, city, price, predicted, change, percentage }
        };
      }
    }
    
    // Negotiation advice
    if (message.includes('negotiate') || message.includes('बातचीत') || message.includes('deal')) {
      return {
        type: 'negotiation',
        content: aiResponses.negotiation[currentLanguage] || aiResponses.negotiation.en,
        tips: [
          'Start with market research - know the average price',
          'Highlight your product quality',
          'Be willing to bundle products for better deals',
          'Consider seasonal demand patterns',
          'Build long-term relationships with buyers'
        ]
      };
    }
    
    // Weather impact
    if (message.includes('weather') || message.includes('मौसम') || message.includes('rain')) {
      return {
        type: 'weather',
        content: aiResponses.weather[currentLanguage] || aiResponses.weather.en
      };
    }
    
    // Fair trade calculation
    if (message.includes('fair') || message.includes('निष्पक्ष') || message.includes('calculate')) {
      return {
        type: 'fair-trade',
        content: 'I can help you calculate if a deal is fair. Please provide the selling price, market price, and product quality (excellent/good/average/poor).',
        showCalculator: true
      };
    }
    
    // Default response
    return {
      type: 'general',
      content: 'I can help you with price information, negotiation strategies, weather impacts, and fair trade calculations. What would you like to know?'
    };
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        ...aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const FairTradeCalculator = ({ onCalculate }) => {
    const [sellingPrice, setSellingPrice] = useState('');
    const [marketPrice, setMarketPrice] = useState('');
    const [quality, setQuality] = useState('good');

    const calculate = () => {
      if (sellingPrice && marketPrice) {
        const result = calculateFairTradeScore(
          parseFloat(sellingPrice),
          parseFloat(marketPrice),
          quality
        );
        onCalculate(result, sellingPrice, marketPrice, quality);
      }
    };

    return (
      <div className="fair-trade-calculator">
        <h4>Fair Trade Calculator</h4>
        <div className="calculator-inputs">
          <input
            type="number"
            placeholder="Selling Price (₹/kg)"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Market Price (₹/kg)"
            value={marketPrice}
            onChange={(e) => setMarketPrice(e.target.value)}
          />
          <select value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="excellent">Excellent Quality</option>
            <option value="good">Good Quality</option>
            <option value="average">Average Quality</option>
            <option value="poor">Poor Quality</option>
          </select>
          <button onClick={calculate} className="calculate-btn">
            <Calculator size={16} />
            Calculate
          </button>
        </div>
      </div>
    );
  };

  const MessageBubble = ({ message }) => {
    const isBot = message.type === 'bot';
    
    return (
      <div className={`message-bubble ${isBot ? 'bot' : 'user'}`}>
        <div className="message-avatar">
          {isBot ? <Bot size={20} /> : <User size={20} />}
        </div>
        <div className="message-content">
          <div className="message-text">{message.content}</div>
          
          {message.type === 'price-info' && message.data && (
            <div className="price-info-card">
              <div className="price-header">
                <span className="product-icon">{products.find(p => p.id === message.data.product.id)?.icon}</span>
                <span>{t(message.data.product.id)} in {t(message.data.city.id)}</span>
              </div>
              <div className="price-details">
                <div className="current-price">
                  <span>Current: ₹{message.data.price}/kg</span>
                </div>
                <div className="predicted-price">
                  <span>Tomorrow: ₹{message.data.predicted}/kg</span>
                  <span className={`change ${message.data.change >= 0 ? 'up' : 'down'}`}>
                    ({message.data.change >= 0 ? '+' : ''}{message.data.percentage}%)
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {message.type === 'negotiation' && message.tips && (
            <div className="tips-card">
              <div className="tips-header">
                <Lightbulb size={16} />
                <span>Negotiation Tips</span>
              </div>
              <ul className="tips-list">
                {message.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          {message.showCalculator && (
            <FairTradeCalculator 
              onCalculate={(result, selling, market, quality) => {
                const calculationMessage = {
                  id: Date.now(),
                  type: 'bot',
                  content: `Fair Trade Analysis: Selling at ₹${selling}/kg vs Market ₹${market}/kg for ${quality} quality.`,
                  calculation: { result, selling, market, quality },
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, calculationMessage]);
              }}
            />
          )}
          
          {message.calculation && (
            <div className={`calculation-result ${message.calculation.result.score}`}>
              <div className="result-header">
                <span className={`score-indicator ${message.calculation.result.score}`}></span>
                <span>{message.calculation.result.text}</span>
              </div>
              <div className="result-details">
                Quality: {message.calculation.quality} | 
                Ratio: {(message.calculation.selling / message.calculation.market).toFixed(2)}
              </div>
            </div>
          )}
          
          <div className="message-time">
            {message.timestamp.toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ai-assistant">
      <div className="assistant-header">
        <div className="header-content">
          <div className="header-icon">
            <Bot size={32} />
          </div>
          <div className="header-text">
            <h1>{t('aiAssistant')}</h1>
            <p>Your intelligent negotiation partner</p>
          </div>
        </div>
        <div className="language-indicator">
          {currentLanguage === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="typing-indicator">
              <div className="message-bubble bot">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="quick-suggestions">
            <button 
              className="suggestion-chip"
              onClick={() => setInputMessage('What is the current price of tomatoes?')}
            >
              🍅 Tomato prices
            </button>
            <button 
              className="suggestion-chip"
              onClick={() => setInputMessage('How to negotiate better deals?')}
            >
              💬 Negotiation tips
            </button>
            <button 
              className="suggestion-chip"
              onClick={() => setInputMessage('Calculate fair trade score')}
            >
              📊 Fair trade
            </button>
          </div>
          
          <div className="input-box">
            <button 
              className={`voice-button ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceInput}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('typeMessage')}
              className="message-input"
              rows="1"
            />
            
            <button 
              className="send-button"
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;