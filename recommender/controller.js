const City = require('./city.model')
const Survey = require('./survey.model')


const distance = require('euclidean-distance');
const pick = require('lodash/pick');
const shuffle = require('lodash/shuffle');
const sampleSize = require('lodash/sampleSize');
const sample = require('lodash/sample');
const sumBy = require('lodash/sumBy');
const includes = require('lodash/includes');
const vanillaFilter = require('lodash/filter');
const vanillaTake = require('lodash/take');
const vanillaTakeRight = require('lodash/takeRight');
const parseInt = require('lodash/parseInt');
const isInteger = require('lodash/isInteger');
const pickBy = require('lodash/pickBy');
const get = require('lodash/get');

const filter = require('lodash/fp/filter');
const find = require('lodash/find');
const map = require('lodash/fp/map');
const take = require('lodash/fp/take');
const sortBy = require('lodash/fp/sortBy');
const flow = require('lodash/fp/flow');

const { calculateCritiques, constructStatistics, getUserModel, updateUserModel } = require('./Critiquer');

const featureCodeToName = {
  cost: 'costOfLivingIndexScaled',
  temperature: 'averageTemperatureScaled',
  food: 'foodScaled',
  arts: 'artsAndEntertainmentScaled',
  outdoors: 'outdoorsAndRecreationScaled',
  nightlife: 'nightlifeScaled',
  shops: 'shopsAndServicesScaled',
  transport: 'travelAndTransportScaled',
}

async function postSurvey(req, res) {
  console.log(req.body);

  const requestDetails = {
    remoteAddress: get(req, 'connection.remoteAddress', 'NA'),
    referer: get(req, 'headers.referer', 'NA'),
    userAgent: get(req, 'headers.user-agent', 'NA'),
    ip: get(req, 'headers.x-forwarded-for', 'NA')
  }

  let version = req.body.version;

  if (version === 3 || version === 4 || version === 5) {
    Survey.create({...req.body, recommendations: getRecommendations(req.session, version), requestDetails, recommendation: getSelectedCity(req.session)},
      (err, survey) => {
        if (err) return res.status(500).send('A problem occurred while adding the survey to the database!');
        res.status(200).send('Survey answers submitted successfully!');
      });
  } else {
    Survey.create({...req.body, requestDetails, recommendations: getRecommendations(req.session, version), recommendation: getSelectedCity(req.session)},
      (err, survey) => {
        if (err) return res.status(500).send('A problem occurred while adding the survey to the database!');
        res.status(200).send('Survey answers submitted successfully!');
      });
  }
}


async function listCities(req, res, next) {
  try {
    const cities = await City.find()
      .select('name country climateType costOfLivingIndexBin pictureUrl distanceFromCentroid cluster')
      .exec();

    const initialCities = [];

    // cluster 1
    const c1Cities = flow(
      filter(c => c.cluster === 1),
      sortBy('distanceFromCentroid'),
      take(16)
    )(cities);
    // cluster 2
    const c2Cities = flow(
      filter(c => c.cluster === 2),
      sortBy('distanceFromCentroid'),
      take(16)
    )(cities);
    // cluster 3
    const c3Cities = flow(
      filter(c => c.cluster === 3),
      sortBy('distanceFromCentroid'),
      take(16)
    )(cities);
    // cluster 4 - small cluster
    const c4Cities = flow(
      filter(c => c.cluster === 4),
      sortBy('distanceFromCentroid'),
      take(5)
    )(cities);
    // cluster 5
    const c5Cities = flow(
      filter(c => c.cluster === 5),
      sortBy('distanceFromCentroid'),
      take(16)
    )(cities);

    initialCities.push(sample(vanillaTake(c1Cities, 8)));
    initialCities.push(sample(vanillaTakeRight(c1Cities, 8)));

    initialCities.push(sample(vanillaTake(c2Cities, 8)));
    initialCities.push(sample(vanillaTakeRight(c2Cities, 8)));

    initialCities.push(sample(vanillaTake(c3Cities, 8)));
    initialCities.push(sample(vanillaTakeRight(c3Cities, 8)));

    initialCities.push(sample(vanillaTake(c4Cities, 5)));

    initialCities.push(sample(vanillaTake(c5Cities, 8)));
    initialCities.push(sample(vanillaTakeRight(c5Cities, 8)));

    const alreadySelectedCityIds = initialCities.map(c => String(c._id));
    const remainingCanditateCities = vanillaFilter(cities, c => !includes(alreadySelectedCityIds, String(c._id)))

    initialCities.push(...sampleSize(remainingCanditateCities, 3));

    res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
    return res.status(200).json(shuffle(initialCities));
  } catch (error) {
    next(error);
  }
}

async function recommendInitialCity(req, res, next) {
  try {
    let selectedCityIds = [];
    if (req.query['selected_cities']) {
      selectedCityIds = Array.isArray(req.query['selected_cities']) ? req.query['selected_cities'] : [req.query['selected_cities']];
    }
    if (selectedCityIds.length === 0 && !req.session.recommendations) {
      return res.status(400).json('Selected cities are missing!');
    }
    const cities = await City.find()
      .exec();

    req.session.recommendations = [];
    req.session.initialCities = vanillaFilter(cities, c => includes(selectedCityIds, String(c._id)));

    //get the city for user profile as the last recommendation. If this is the first iteration, get the cities from
    // selected_city_ids
    const userPreferredCities = req.session.initialCities;

    const userProfile = {
      costOfLivingIndexScaled: sumBy(userPreferredCities, 'costOfLivingIndexScaled') / userPreferredCities.length,
      venueCountScaled: sumBy(userPreferredCities, 'venueCountScaled') / userPreferredCities.length,
      averageTemperatureScaled: sumBy(userPreferredCities, 'averageTemperatureScaled') / userPreferredCities.length,
      averagePrecipitationScaled: sumBy(userPreferredCities, 'averagePrecipitationScaled') / userPreferredCities.length,
      foodScaled: sumBy(userPreferredCities, 'foodScaled') / userPreferredCities.length,
      artsAndEntertainmentScaled: sumBy(userPreferredCities, 'artsAndEntertainmentScaled') / userPreferredCities.length,
      outdoorsAndRecreationScaled: sumBy(userPreferredCities, 'outdoorsAndRecreationScaled') / userPreferredCities.length,
      nightlifeScaled: sumBy(userPreferredCities, 'nightlifeScaled') / userPreferredCities.length,
    }

    const refinements = {
      cost: parseInt(req.query['cost']),
      temperature: parseInt(req.query['temperature']),
      food: parseInt(req.query['food']),
      arts: parseInt(req.query['arts']),
      outdoors: parseInt(req.query['outdoors']),
      nightlife: parseInt(req.query['nightlife'])
    }

    const activeRefinements = pickBy(refinements, isInteger);

    for (const [featureCode, value] of Object.entries(activeRefinements)) {
      userProfile[featureCodeToName[featureCode]] = userProfile[featureCodeToName[featureCode]] + (value / 5);
      if (userProfile[featureCodeToName[featureCode]] < 0) {
        userProfile[featureCodeToName[featureCode]] = 0
      } else if (userProfile[featureCodeToName[featureCode]] > 1) {
        userProfile[featureCodeToName[featureCode]] = 1
      }
    }

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
        [userProfile.costOfLivingIndexScaled,
          userProfile.venueCountScaled,
          userProfile.averageTemperatureScaled,
          userProfile.averagePrecipitationScaled,
          userProfile.foodScaled,
          userProfile.artsAndEntertainmentScaled,
          userProfile.outdoorsAndRecreationScaled,
          userProfile.nightlifeScaled]
      );
    });


    const citiesToRecommend = flow(
      // filter(c => !includes(selectedCityIds, String(c._id))),   // uncomment to filter out selected cities from recommendations
      sortBy('distance'),
      take(1)
    )(cities);

    req.session.recommendations = [citiesToRecommend[0]];
    let remainingCities = vanillaFilter(cities, c => !includes(citiesToRecommend.map(c => c._id), c._id));
    req.session.remainingCities = remainingCities;

    res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
    return res.status(200).json(citiesToRecommend);
  } catch (error) {
    next(error);
  }
}

async function recommendCity(req, res, next) {
  try {
    const remainingCities = req.session.remainingCities;


    const userPreferredCity = req.session.recommendations[req.session.recommendations.length - 1];

    const userProfile = userPreferredCity;

    const refinements = {
      cost: parseInt(req.query['cost']),
      temperature: parseInt(req.query['temperature']),
      food: parseInt(req.query['food']),
      arts: parseInt(req.query['arts']),
      outdoors: parseInt(req.query['outdoors']),
      nightlife: parseInt(req.query['nightlife'])
    }

    const activeRefinements = pickBy(refinements, isInteger);

    for (const [featureCode, value] of Object.entries(activeRefinements)) {
      userProfile[featureCodeToName[featureCode]] = userProfile[featureCodeToName[featureCode]] + (value / 10);
      if (userProfile[featureCodeToName[featureCode]] < 0) {
        userProfile[featureCodeToName[featureCode]] = 0
      } else if (userProfile[featureCodeToName[featureCode]] > 1) {
        userProfile[featureCodeToName[featureCode]] = 1
      }
    }

    remainingCities.forEach(c => {
      c.distance = distance(
        [c.costOfLivingIndexScaled,
          c.venueCountScaled,
          c.averageTemperatureScaled,
          c.averagePrecipitationScaled,
          c.foodScaled,
          c.artsAndEntertainmentScaled,
          c.outdoorsAndRecreationScaled,
          c.nightlifeScaled],
        [userProfile.costOfLivingIndexScaled,
          userProfile.venueCountScaled,
          userProfile.averageTemperatureScaled,
          userProfile.averagePrecipitationScaled,
          userProfile.foodScaled,
          userProfile.artsAndEntertainmentScaled,
          userProfile.outdoorsAndRecreationScaled,
          userProfile.nightlifeScaled]
      );
    });


    const citiesToRecommend = flow(
      // filter(c => !includes(selectedCityIds, String(c._id))),   // uncomment to filter out selected cities from recommendations
      sortBy('distance'),
      take(1)
    )(remainingCities);

    req.session.recommendations = [...req.session.recommendations, citiesToRecommend[0]];
    req.session.remainingCities = vanillaFilter(remainingCities, c => !includes(citiesToRecommend.map(c => c._id), c._id));

    res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
    return res.status(200).json(citiesToRecommend);
  } catch (error) {
    next(error);
  }
}

async function recommendInitialCityWithCritiques(req, res, next) {
  try {
    let selectedCityIds = [];
    if (req.query['selected_cities']) {
      selectedCityIds = Array.isArray(req.query['selected_cities']) ? req.query['selected_cities'] : [req.query['selected_cities']];
    }
    if (selectedCityIds.length === 0) {
      return res.status(400).json('Selected cities are missing!');
    }

    let mean = req.query['mean'];
    let std = req.query['std'];
    let version =  Number(req.query.version);

    if (!version) {
      return res.status(400).json('Version is missing!');
    }

    const cities = await City.find()
      .exec();
    const selectedCities = vanillaFilter(cities, c => includes(selectedCityIds, String(c._id)));

    req.session.initialCities = selectedCities;
    req.session.recommendations = [];
    req.session.userModel = getUserModel(selectedCities);
    req.session.remainingCities = cities;

    const initialUserProfile = {
      costOfLivingIndexScaled: sumBy(selectedCities, 'costOfLivingIndexScaled') / selectedCities.length,
      venueCountScaled: sumBy(selectedCities, 'venueCountScaled') / selectedCities.length,
      averageTemperatureScaled: sumBy(selectedCities, 'averageTemperatureScaled') / selectedCities.length,
      averagePrecipitationScaled: sumBy(selectedCities, 'averagePrecipitationScaled') / selectedCities.length,
      foodScaled: sumBy(selectedCities, 'foodScaled') / selectedCities.length,
      artsAndEntertainmentScaled: sumBy(selectedCities, 'artsAndEntertainmentScaled') / selectedCities.length,
      outdoorsAndRecreationScaled: sumBy(selectedCities, 'outdoorsAndRecreationScaled') / selectedCities.length,
      nightlifeScaled: sumBy(selectedCities, 'nightlifeScaled') / selectedCities.length,
    };

    cities.forEach(c => {
      c.distance = distance(
        [c.costOfLivingIndexScaled,
          c.averageTemperatureScaled,
          c.averagePrecipitationScaled,
          c.foodScaled,
          c.artsAndEntertainmentScaled,
          c.outdoorsAndRecreationScaled,
          c.nightlifeScaled,
          c.venueCountScaled],
        [initialUserProfile.costOfLivingIndexScaled,
          initialUserProfile.averageTemperatureScaled,
          initialUserProfile.averagePrecipitationScaled,
          initialUserProfile.foodScaled,
          initialUserProfile.artsAndEntertainmentScaled,
          initialUserProfile.outdoorsAndRecreationScaled,
          initialUserProfile.nightlifeScaled,
          initialUserProfile.venueCountScaled]
      );
    });

    const initialCitiesToRecommend = flow(
      sortBy('distance'),
      take(1)
    )(cities);

    //remove current selected city from remaining cities for recommendation
    let cityToRecommend = initialCitiesToRecommend[0];
    req.session.remainingCities = vanillaFilter(req.session.remainingCities, c => c._id !== cityToRecommend._id);

    //the remaining cities to make critiques
    let remainingCities = req.session.remainingCities;

    let critiques = calculateCritiques(cityToRecommend, req, remainingCities, 6, version, mean, std);

    //update session
    let recommendations = {'recommendation': cityToRecommend, 'critiques': critiques['critiques']};
    req.session.recommendations = [recommendations];

    res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
    let citiesToRecommend = [cityToRecommend, ...critiques['critiques']];

    remainingCities = vanillaFilter(cities, c => !includes(citiesToRecommend.map(c => c._id), c._id));
    req.session.remainingCities = remainingCities;

    return res.status(200).json({
      'recommendations': citiesToRecommend,
      'stats': constructStatistics(citiesToRecommend, critiques.stats, req.session.userModel)
    });
  } catch (error) {
    next(error);
  }
}

async function recommendCityWithCritiques(req, res, next) {
  try {
    let selectedCityId = req.query['selectedCityId'];
    if (!selectedCityId) {
      return res.status(400).json('Selected city is missing!');
    }

    let mean = req.query['mean'];
    let std = req.query['std'];
    let version =  Number(req.query.version);

    const selectedCity = await City.findById(selectedCityId)
      .exec();

    //remove current selected city from remaining cities
    req.session.remainingCities = vanillaFilter(req.session.remainingCities, c => c._id !== selectedCity._id);

    let remainingCities = req.session.remainingCities;

    let lastRecommendation = req.session.recommendations[req.session.recommendations.length - 1]['recommendation'];
    //update user model before critiquing
    req.session.userModel = updateUserModel(selectedCity, req);


    //if the selected city is the carrying preference
    let prevSession = find(req.session.recommendations, c => c['recommendation']._id === String(selectedCity._id));

    let critiques = calculateCritiques(selectedCity, req, remainingCities, prevSession? 6 : 5, version, mean, std);

    let critiqueCities = prevSession ? [...critiques['critiques']] : [...critiques['critiques'], lastRecommendation];

    //update session
    let recommendations = {'recommendation': selectedCity, 'critiques': critiqueCities};
    let recommendationsSoFar = req.session.recommendations;
    recommendationsSoFar.push(recommendations);
    req.session.recommendations = recommendationsSoFar;

    let citiesToRecommend = [selectedCity];
    citiesToRecommend = citiesToRecommend.concat(critiqueCities);

    res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');

    remainingCities = vanillaFilter(remainingCities, c => !includes(citiesToRecommend.map(c => c._id), c._id));
    req.session.remainingCities = remainingCities;

    return res.status(200).json({
      'recommendations': citiesToRecommend,
      'stats': constructStatistics(citiesToRecommend, critiques.stats, req.session.userModel)
    });
  } catch (error) {
    next(error);
  }
}

function getRecommendations(session, version){
  let recommendations = session.recommendations;

  if (version !== 2){
    let recommendationStats = recommendations.map(recommendation => {
      let recommendationStat = {};
      recommendationStat["recommendation"] = recommendation.recommendation.name;

      recommendationStat["critiques"] = recommendation.critiques.map( critique =>
        critique.name
      );

      return recommendationStat;
    });
    return recommendationStats;
  } else {
    let recommendationStats = recommendations.map(recommendation =>
    recommendation.recommendation.name
    );
    return recommendationStats;
  }

};

function getSelectedCity(session) {
  let recommendations = session.recommendations;

  return recommendations[recommendations.length - 1].recommendation.name;
}


module.exports = {
  listCities,
  recommendInitialCity,
  recommendCity,
  postSurvey,
  recommendCityWithCritiques,
  recommendInitialCityWithCritiques
}