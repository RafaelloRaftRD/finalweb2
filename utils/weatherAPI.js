const axios = require('axios');

// Get weather recommendation for drinks
exports.getWeatherRecommendation = async (city = 'London') => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        message: 'Weather API key not configured'
      };
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const temp = response.data.main.temp;
    const weather = response.data.weather[0].main;

    let recommendation = {
      temperature: temp,
      weather: weather,
      suggestion: ''
    };

    // Recommend drinks based on weather
    if (temp < 10) {
      recommendation.suggestion = 'Try our Hot Chocolate or Cappuccino to warm up!';
    } else if (temp >= 10 && temp < 20) {
      recommendation.suggestion = 'Perfect weather for our Latte or Americano!';
    } else {
      recommendation.suggestion = 'Cool down with our Iced Coffee or Cold Brew!';
    }

    return {
      success: true,
      data: recommendation
    };
  } catch (error) {
    return {
      success: false,
      message: 'Unable to fetch weather data',
      error: error.message
    };
  }
};