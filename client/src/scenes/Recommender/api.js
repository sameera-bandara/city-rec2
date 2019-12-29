import { get, post } from 'axios';
import City from './city.model';

export const postSurvey = async (surveyData) => {
  try {
    const response = await post('/api/survey', surveyData);
    return response.data;
  } catch (error) {
    //
  }
}

export const fetchCities = async () => {
  try {
    const response = await get('/api/cities');
    const cities = response.data.map(City.parse);
    return cities;
  } catch (error) {
    return [];
  }
}

export const fetchRecommendations = async selectedCities => {
  try {
    const params = new URLSearchParams();
    for (const city of selectedCities) {
      params.append('selected_cities', city)
    }

    const response = await get('/api/initial-recommendation', { params });
    const cities = response.data.map(City.parse);
    return cities;
  } catch (error) {
    return [];
  }
}

export const fetchRefinedRecommendations = async (refinements) => {
  try {
    const params = new URLSearchParams();

    for (let [option, value] of Object.entries(refinements)) {
      params.append(option, value)
    }

    const response = await get('/api/recommendation', { params });
    const cities = response.data.map(City.parse);
    return cities;
  } catch (error) {
    return [];
  }
}

export const fetchInitialRecommendationWithCritiques = async (selectedCities, version) => {
  try {
    const params = new URLSearchParams();
    for (const city of selectedCities) {
      params.append('selected_cities', city)
    }
    params.append('version', version);
    const response = await get('/api/initial-recommendations-with-critiques', { params });

    const cities = response.data.recommendations.map(City.parse);
    const statistics = response.data.stats;
    cities[0].currentRecommendation = true;
    return {"cities": cities, "statistics": statistics};
  } catch (error) {
    return [];
  }
}


export const fetchRecommendationWithCritiques = async (selectedCityId, version) => {
  try {
    const params = new URLSearchParams();
    params.append('selectedCityId', selectedCityId);
    params.append('version', version);

    const response = await get('/api/recommendations-with-critiques', { params });

    const cities = response.data.recommendations.map(City.parse);
    const statistics = response.data.stats;
    cities[0].currentRecommendation = true;
    return {"cities": cities, "statistics": statistics};
  } catch (error) {
    return [];
  }
}