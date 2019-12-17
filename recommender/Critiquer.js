const take = require('lodash/fp/take');
const sortBy = require('lodash/fp/sortBy');
const reverse = require('lodash/fp/reverse');
const flow = require('lodash/fp/flow');
const distance = require('euclidean-distance');

const normalDistribution = require('./NormalDistribution');
const stats = require('stats-lite');

let MEAN_1 = 3; //5, 3,1, 0.5

let STD_1 = 11;

function calculateCritiques(currentRecommendedCity, req, cities, noOfCritiques, version, mean, std) {
  switch (version) {
    case 3:
    case 4:
      return calculateCritiquesByDistribution(currentRecommendedCity, req, cities, noOfCritiques, version, mean, std);
    default:
      return calculateCritiquesByDistance(currentRecommendedCity, cities, noOfCritiques);
  }
}

function calculateCritiquesByDistribution(currentRecommendedCity, req, cities, noOfCritiques, version, mean, std){
  if (mean ){
    MEAN_1 = mean;
  }

  if (std){
    STD_1 = std;
  }

  let utilityDistributions = calculateDistributions(currentRecommendedCity, req, version);
  let citiesWithUtilitiesLeft = cities.map(c => calculateUtilityLeft(c, utilityDistributions['distributions']));
  let citiesWithUtilitiesRight = cities.map(c => calculateUtilityRight(c, utilityDistributions['distributions']));

  let sortedCitiesWithUtilitiesLeft = citiesWithUtilitiesLeft.sort((a, b) => {
    return (b['utilityScore'] - a['utilityScore'])
  });
  let recommendationLeft = flow(
    take(version === 3 ? 3 : 6)
  )(sortedCitiesWithUtilitiesLeft);

  let sortedCitiesWithUtilitiesRight = citiesWithUtilitiesRight.sort((a, b) => {
    return (b['utilityScore'] - a['utilityScore'])
  });
  let recommendationRight = flow(
    take(version === 3 ? 3 : 6)
  )(sortedCitiesWithUtilitiesRight);

  if (version === 4){
    //in version 4, left and right distributions are same. So both arrays selects same cities
    recommendationRight = []
  }

  let critiques = flow(
    sortBy('utilityScore'),
    reverse,
    take(noOfCritiques)
  )([...recommendationLeft, ...recommendationRight]);

  return {
    'critiques': critiques.map(c => c.city),
    'stats': utilityDistributions['stats']
  };
}

function calculateCritiquesByDistance(currentRecommendation, cities, noOfCritiques){
  cities.forEach(c => {
    c.distance = distance(
      [c.costOfLivingIndexScaled,
        c.venueCountScaled,
        c.averageTemperatureScaled,
        c.averagePrecipitationScaled,
        c.foodScaled,
        c.artsAndEntertainmentScaled,
        c.outdoorsAndRecreationScaled,
        c.nightlifeScaled],
      [currentRecommendation.costOfLivingIndexScaled,
        currentRecommendation.venueCountScaled,
        currentRecommendation.averageTemperatureScaled,
        currentRecommendation.averagePrecipitationScaled,
        currentRecommendation.foodScaled,
        currentRecommendation.artsAndEntertainmentScaled,
        currentRecommendation.outdoorsAndRecreationScaled,
        currentRecommendation.nightlifeScaled]
    );
  });

  const critiques = flow(
    sortBy('distance'),
    take(noOfCritiques)
  )(cities);

  return {
    'critiques': critiques,
    'stats': []
  }
}

function getUserModel(cities) {
  let food = {'mean': calculateMean(cities,'foodScaled'), 'variance': calculateVariance(cities,'foodScaled')};
  let arts = {'mean': calculateMean(cities,'artsAndEntertainmentScaled'), 'variance': calculateVariance(cities,'artsAndEntertainmentScaled')};
  let nightlife = {'mean': calculateMean(cities,'nightlifeScaled'), 'variance': calculateVariance(cities,'nightlifeScaled')};
  let outdoor = {'mean': calculateMean(cities,'outdoorsAndRecreationScaled'), 'variance': calculateVariance(cities,'outdoorsAndRecreationScaled')};
  let temperature = {'mean': calculateMean(cities,'averageTemperatureScaled'), 'variance': calculateVariance(cities,'averageTemperatureScaled')};
  let cost = {'mean': calculateMean(cities,'costOfLivingIndexScaled'), 'variance': calculateVariance(cities,'costOfLivingIndexScaled')};
  let precipitation = {'mean': calculateMean(cities,'averagePrecipitationScaled'), 'variance': calculateVariance(cities,'averagePrecipitationScaled')};
  let venueCount = {'mean': calculateMean(cities,'venueCountScaled'), 'variance': calculateVariance(cities,'venueCountScaled')};

  return {'food': food, 'arts': arts, 'nightlife': nightlife, 'outdoor': outdoor, 'temperature': temperature, 'cost': cost, 'precipitation': precipitation, 'venueCount': venueCount, 'noOfItems': cities.length}
}

function updateUserModel(city, req) {
  let userModel = req.session.userModel;

  let food = {'mean': getUpdatedMean(userModel.food.mean, userModel.noOfItems, city.foodScaled), 'variance': getUpdatedVariance(userModel.food.variance, userModel.food.mean, userModel.noOfItems, city.foodScaled)};
  let arts = {'mean': getUpdatedMean(userModel.arts.mean, userModel.noOfItems, city.artsAndEntertainmentScaled), 'variance': getUpdatedVariance(userModel.arts.variance, userModel.arts.mean, userModel.noOfItems, city.artsAndEntertainmentScaled)};
  let nightlife = {'mean': getUpdatedMean(userModel.nightlife.mean, userModel.noOfItems, city.nightlifeScaled), 'variance': getUpdatedVariance(userModel.nightlife.variance, userModel.nightlife.mean, userModel.noOfItems, city.nightlifeScaled)};
  let outdoor = {'mean': getUpdatedMean(userModel.outdoor.mean, userModel.noOfItems, city.outdoorsAndRecreationScaled), 'variance': getUpdatedVariance(userModel.outdoor.variance, userModel.outdoor.mean, userModel.noOfItems, city.outdoorsAndRecreationScaled)};
  let temperature = {'mean': getUpdatedMean(userModel.temperature.mean, userModel.noOfItems, city.averageTemperatureScaled), 'variance': getUpdatedVariance(userModel.temperature.variance, userModel.temperature.mean, userModel.noOfItems, city.averageTemperatureScaled)};
  let cost = {'mean': getUpdatedMean(userModel.cost.mean, userModel.noOfItems, city.costOfLivingIndexScaled), 'variance': getUpdatedVariance(userModel.cost.variance, userModel.cost.mean, userModel.noOfItems, city.costOfLivingIndexScaled)};
  let precipitation = {'mean': getUpdatedMean(userModel.precipitation.mean, userModel.noOfItems, city.averagePrecipitationScaled), 'variance': getUpdatedVariance(userModel.precipitation.variance, userModel.precipitation.mean, userModel.noOfItems, city.averagePrecipitationScaled)};
  let venueCount = {'mean': getUpdatedMean(userModel.venueCount.mean, userModel.noOfItems, city.venueCountScaled), 'variance': getUpdatedVariance(userModel.venueCount.variance, userModel.venueCount.mean, userModel.noOfItems, city.venueCountScaled)};

  return {'food': food, 'arts': arts, 'nightlife': nightlife, 'outdoor': outdoor, 'temperature': temperature, 'cost': cost, 'precipitation': precipitation, 'venueCount': venueCount, 'noOfItems': ++userModel.noOfItems}
}

function getUpdatedVariance(currentVariance, currentMean, noOfItems, newFeatureValue) {
  //https://math.stackexchange.com/questions/775391/can-i-calculate-the-new-standard-deviation-when-adding-a-value-without-knowing-t
  let newMean = (currentMean * noOfItems + newFeatureValue)/(noOfItems + 1)
  return (noOfItems * currentVariance + (newFeatureValue - newMean) * (newFeatureValue - currentMean)) / (noOfItems + 1);
}

function getUpdatedMean(currentMean, noOfItems, newFeatureValue) {
  return (currentMean * noOfItems + newFeatureValue) / (noOfItems + 1);
}

function calculateVariance(cities, feature) {
  let featureVals = cities.map(city => city[feature]);
  return stats.variance(featureVals);
}

function calculateMean(cities, feature) {
  let featureVals = cities.map(city => city[feature]);
  return stats.mean(featureVals);
}

function getDistributionLeft(pivot, standardDeviation, iterations, version) {
  let adjustedMean = (MEAN_1 * standardDeviation) /  iterations;
  let adjustedStd = (STD_1 * standardDeviation) /  iterations;

  return version === 4 ? new normalDistribution(pivot, adjustedStd) : new normalDistribution(pivot - adjustedMean, adjustedStd);
}

function getDistributionRight(pivot, standardDeviation, iterations, version) {
  let adjustedMean = (MEAN_1 * standardDeviation) /  iterations;
  let adjustedStd = (STD_1 * standardDeviation) /   iterations;

  return version === 4 ? new normalDistribution(pivot, adjustedStd) : new normalDistribution(pivot + adjustedMean, adjustedStd);
}

function calculateDistributions(currentRecommendedCity, req, version) {
  let noOfIterations = req.session.recommendations.length + 1;
  let userModel = req.session.userModel;

  let foodStd = Math.sqrt(userModel.food.variance);
  let distributionLeftFood = getDistributionLeft(currentRecommendedCity.foodScaled, foodStd, noOfIterations, version);
  let distributionRightFood = getDistributionRight(currentRecommendedCity.foodScaled, foodStd, noOfIterations, version);
  let foodDistributions = {'left': distributionLeftFood, 'right': distributionRightFood};


  let nightlifeStd = Math.sqrt(userModel.nightlife.variance);
  let distributionLeftNightlife = getDistributionLeft(currentRecommendedCity.nightlifeScaled, nightlifeStd, noOfIterations, version);
  let distributionRightNightlife = getDistributionRight(currentRecommendedCity.nightlifeScaled, nightlifeStd, noOfIterations, version);
  let nightlifeDistributions = {'left': distributionLeftNightlife, 'right': distributionRightNightlife};

  let artsStd = Math.sqrt(userModel.arts.variance);
  let distributionLeftArts = getDistributionLeft(currentRecommendedCity.artsAndEntertainmentScaled, artsStd, noOfIterations, version);
  let distributionRightArts = getDistributionRight(currentRecommendedCity.artsAndEntertainmentScaled, artsStd, noOfIterations, version);
  let artsDistributions = {'left': distributionLeftArts, 'right': distributionRightArts};

  let outdoorStd = Math.sqrt(userModel.outdoor.variance);
  let distributionLeftOutdoor = getDistributionLeft(currentRecommendedCity.outdoorsAndRecreationScaled, outdoorStd, noOfIterations, version);
  let distributionRightOutdoor = getDistributionRight(currentRecommendedCity.outdoorsAndRecreationScaled, outdoorStd, noOfIterations, version);
  let outdoorDistributions = {'left': distributionLeftOutdoor, 'right': distributionRightOutdoor};

  let temperatureStd = Math.sqrt(userModel.temperature.variance);
  let distributionLeftTemp = getDistributionLeft(currentRecommendedCity.averageTemperatureScaled, temperatureStd, noOfIterations, version);
  let distributionRightTemp = getDistributionRight(currentRecommendedCity.averageTemperatureScaled, temperatureStd, noOfIterations, version);
  let temperatureDistributions = {'left': distributionLeftTemp, 'right': distributionRightTemp};

  let costStd = Math.sqrt(userModel.cost.variance);
  let distributionLeftCost = getDistributionLeft(currentRecommendedCity.costOfLivingIndexScaled, costStd, noOfIterations, version);
  let distributionRightCost = getDistributionRight(currentRecommendedCity.costOfLivingIndexScaled, costStd, noOfIterations, version);
  let costDistributions = {'left': distributionLeftCost, 'right': distributionRightCost};

  let precipitationStd = Math.sqrt(userModel.precipitation.variance);
  let distributionLeftPrecp = getDistributionLeft(currentRecommendedCity.averagePrecipitationScaled, precipitationStd, noOfIterations, version);
  let distributionRightPrecp = getDistributionRight(currentRecommendedCity.averagePrecipitationScaled, precipitationStd, noOfIterations, version);
  let precipitationDistributions = {'left': distributionLeftPrecp, 'right': distributionRightPrecp};

  let venueCountStd = Math.sqrt(userModel.venueCount.variance);
  let distributionLeftVenue = getDistributionLeft(currentRecommendedCity.venueCountScaled, venueCountStd, noOfIterations, version);
  let distributionRightVenue = getDistributionRight(currentRecommendedCity.venueCountScaled, venueCountStd, noOfIterations, version);
  let venueCountDistributions = {'left': distributionLeftVenue, 'right': distributionRightVenue};

  let statsFood = {
    'food std': foodStd,
    'left distribution': {'mean': distributionLeftFood.mean, 'std': distributionLeftFood.standardDeviation},
    'right distribution': {'mean': distributionRightFood.mean, 'std': distributionRightFood.standardDeviation}
  };
  let statsNightlife = {
    'nightlife std': nightlifeStd,
    'left distribution': {'mean': distributionLeftNightlife.mean, 'std': distributionLeftNightlife.standardDeviation},
    'right distribution': {'mean': distributionRightNightlife.mean, 'std': distributionRightNightlife.standardDeviation}
  };
  let statsArts = {
    'arts std': artsStd,
    'left distribution': {'mean': distributionLeftArts.mean, 'std': distributionLeftArts.standardDeviation},
    'right distribution': {'mean': distributionRightArts.mean, 'std': distributionRightArts.standardDeviation}
  };
  let statsOutdoor = {
    'outdoor std': outdoorStd,
    'left distribution': {'mean': distributionLeftOutdoor.mean, 'std': distributionLeftOutdoor.standardDeviation},
    'right distribution': {'mean': distributionRightOutdoor.mean, 'std': distributionRightOutdoor.standardDeviation}
  };
  let statsCost = {
    'cost std': costStd,
    'left distribution': {'mean': distributionLeftCost.mean, 'std': distributionLeftCost.standardDeviation},
    'right distribution': {'mean': distributionRightCost.mean, 'std': distributionRightCost.standardDeviation}
  };
  let statsTemperature = {
    'temperature std': temperatureStd,
    'left distribution': {'mean': distributionLeftTemp.mean, 'std': distributionLeftTemp.standardDeviation},
    'right distribution': {'mean': distributionRightTemp.mean, 'std': distributionRightTemp.standardDeviation}
  };
  let statsPrecipitation = {
    'precipitation std': precipitationStd,
    'left distribution': {'mean': distributionLeftPrecp.mean, 'std': distributionLeftPrecp.standardDeviation},
    'right distribution': {'mean': distributionRightPrecp.mean, 'std': distributionRightPrecp.standardDeviation}
  };
  let statsVenueCount = {
    'venueCount std': venueCountStd,
    'left distribution': {'mean': distributionLeftVenue.mean, 'std': distributionLeftVenue.standardDeviation},
    'right distribution': {'mean': distributionRightVenue.mean, 'std': distributionRightVenue.standardDeviation}
  };

  let stats = {
    'food': statsFood,
    'nightlife': statsNightlife,
    'arts': statsArts,
    'outdoor': statsOutdoor,
    'cost': statsCost,
    'temperature': statsTemperature,
    'precipitation': statsPrecipitation,
    'venueCount': statsVenueCount,
    'noOfIterations': noOfIterations
  };
  let distributions = {
    'food': foodDistributions,
    'nightlife': nightlifeDistributions,
    'arts': artsDistributions,
    'outdoor': outdoorDistributions,
    'cost': costDistributions,
    'temperature': temperatureDistributions,
    'precipitation': precipitationDistributions,
    'venueCount': venueCountDistributions
  };

  return {'stats': stats, 'distributions': distributions};
}

function calculateUtilityRight(city, distributions) {
  let foodDistRight = distributions['food']['right'];
  let artsDistRight = distributions['arts']['right'];
  let nightlifeDistRight = distributions['nightlife']['right'];
  let outdoorDistRight = distributions['outdoor']['right'];
  let temperatureDistRight = distributions['temperature']['right'];
  let precipitationDistRight = distributions['precipitation']['right'];
  let costDistRight = distributions['cost']['right'];
  let venueCountDistRight = distributions['venueCount']['right'];

  let foodUtility = foodDistRight.pdf(city.foodScaled);
  let artsUtility = artsDistRight.pdf(city.artsAndEntertainmentScaled);
  let nightlifeUtility = nightlifeDistRight.pdf(city.nightlifeScaled);
  let outdoorUtility = outdoorDistRight.pdf(city.outdoorsAndRecreationScaled);
  let temperatureUtility = temperatureDistRight.pdf(city.averageTemperatureScaled);
  let costUtility = costDistRight.pdf(city.costOfLivingIndexScaled);
  let precipitationUtility = precipitationDistRight.pdf(city.averagePrecipitationScaled);
  let venueCountUtility = venueCountDistRight.pdf(city.venueCountScaled);

  let utilityScore = foodUtility + artsUtility + nightlifeUtility + outdoorUtility + temperatureUtility + costUtility + precipitationUtility + venueCountUtility;

  return {'city': city, 'utilityScore': utilityScore}
}

function calculateUtilityLeft(city, distributions) {
  let foodDistLeft = distributions['food']['left'];
  let artsDistLeft = distributions['arts']['left'];
  let nightLifeDistLeft = distributions['nightlife']['left'];
  let outdoorDistLeft = distributions['outdoor']['left'];
  let temperatureDistLeft = distributions['temperature']['left'];
  let precipitationDistLeft = distributions['precipitation']['left'];
  let costDistLeft = distributions['cost']['left'];
  let venueCountDistLeft = distributions['venueCount']['left'];

  let foodUtility = foodDistLeft.pdf(city.foodScaled);
  let artsUtility = artsDistLeft.pdf(city.artsAndEntertainmentScaled);
  let nightlifeUtility = nightLifeDistLeft.pdf(city.nightlifeScaled);
  let outdoorUtility = outdoorDistLeft.pdf(city.outdoorsAndRecreationScaled);
  let temperatureUtility = temperatureDistLeft.pdf(city.averageTemperatureScaled);
  let costUtility = costDistLeft.pdf(city.costOfLivingIndexScaled);
  let precipitationUtility = precipitationDistLeft.pdf(city.averagePrecipitationScaled);
  let venueCountUtility = venueCountDistLeft.pdf(city.venueCountScaled);

  let utilityScore = foodUtility + artsUtility + nightlifeUtility + outdoorUtility + temperatureUtility + costUtility + precipitationUtility + venueCountUtility;

  return {'city': city, 'utilityScore': utilityScore}
}

function extractFeatureValues(cities) {
  let food = cities.map(c => {
    let rObj = {};
    rObj[c.name] = c.foodScaled;
    return rObj;
  });
  let nightlife = cities.map(c => {
    let rObj = {};
    rObj[c.name] = c.nightlifeScaled;
    return rObj;
  });
  let arts = cities.map(c => {
    let rObj = {};
    rObj[c.name] = c.artsAndEntertainmentScaled;
    return rObj;
  });
  let outdoor = cities.map(c => {
    let rObj = {};
    rObj[c.name] = c.outdoorsAndRecreationScaled;
    return rObj;
  });
  let temperature = cities.map(c => {
    let rObj = {};
    rObj[c.name] = c.averageTemperatureScaled;
    return rObj;
  });
  let cost = cities.map(c => {
    let rObj = {};
    rObj[c.name] = c.costOfLivingIndexScaled;
    return rObj;
  });
  let precipitation = cities.map(c => {
    let rObj = {};
    rObj[c.name] = c.averagePrecipitationScaled;
    return rObj;
  });
  let venueCount = cities.map(c => {
    let rObj = {};
    rObj[c.name] = c.venueCountScaled;
    return rObj;
  });

  return {
    'food': food,
    'nightlife': nightlife,
    'arts': arts,
    'outdoor': outdoor,
    'temperature': temperature,
    'cost': cost,
    'precipitation': precipitation,
    'venueCount': venueCount
  };
}

function constructStatistics(cities, stats, userModel) {
  if (stats.length === 0){
    stats = {};
    stats.userModel = userModel;
    return stats;
  }
  let featureValues = extractFeatureValues(cities);

  stats.food.cities = featureValues.food;
  stats.nightlife.cities = featureValues.nightlife;
  stats.arts.cities = featureValues.arts;
  stats.outdoor.cities = featureValues.outdoor;
  stats.cost.cities = featureValues.cost;
  stats.temperature.cities = featureValues.temperature;
  stats.precipitation.cities = featureValues.precipitation;
  stats.venueCount.cities = featureValues.venueCount;
  stats.userModel = userModel;

  return stats;
}

module.exports = {
  calculateCritiques,
  constructStatistics,
  getUserModel,
  updateUserModel
}