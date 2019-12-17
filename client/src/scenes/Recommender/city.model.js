const climateTypeToName = {
  Af: "Tropical rainforest",
  Am: "Tropical wet",
  Aw: "Tropical wet and dry",
  As: "Tropical savanna",
  BWh: "Desert",
  BWk: "Desert",
  BSh: "Semi-arid",
  BSk: "Tropical and subtropical steppe",
  Csa: "Mediterrean",
  Csc: "Mediterrean",
  Csb: "Mediterrean",
  Cwa: "Humid subtropical",
  Cwb: "Oceanic subtropical highland",
  Cwc: "Oceanic subtropical highland",
  Cfa: "Humid subtropical",
  Cfb: "Marine west coast",
  Cfc: "Marine west coast",
  Dsa: "Humid continental",
  Dsb: "Humid continental",
  Dsc: "Subarctic",
  Dsd: "Subarctic",
  Dwa: "Humid continental",
  Dwb: "Humid continental",
  Dwc: "Subarctic",
  Dwd: "Subarctic",
  Dfa: "Hot summer continental",
  Dfb: "Humid continental",
  Dfc: "Continental subarctic",
  Dfd: "Subarctic",
  ET: "Tundra",
  EF: "Ice cap",
}

class City {
  id;
  name;
  country;
  pictureUrl;
  climateType;
  averageTemperature;
  costOfLivingIndexBin;
  food;
  artsAndEntertainment;
  outdoorsAndRecreation;
  travelAndTransport;
  shopsAndServices;
  nightlife;
  averageTemperatureRank;
  foodRank;
  artsAndEntertainmentRank;
  outdoorsAndRecreationRank;
  travelAndTransportRank;
  shopsAndServicesRank;
  nightlifeRank;
  costOfLivingIndexRank;
  averagePrecipitationRank;
  distance;
  currentRecommendation;
  critiquingCity;

  constructor({id, name, country, pictureUrl, climateType, averageTemperature, costOfLivingIndexBin, food, artsAndEntertainment, outdoorsAndRecreation, travelAndTransport, shopsAndServices, nightlife,
                averageTemperatureRank, costOfLivingIndexRank, foodRank, artsAndEntertainmentRank, outdoorsAndRecreationRank, travelAndTransportRank, shopsAndServicesRank, nightlifeRank, averagePrecipitationRank, distance}) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.pictureUrl = pictureUrl;
    this.climateType = climateType;
    this.averageTemperature = averageTemperature;
    this.costOfLivingIndexBin = costOfLivingIndexBin;
    this.food = food;
    this.artsAndEntertainment = artsAndEntertainment;
    this.outdoorsAndRecreation = outdoorsAndRecreation;
    this.travelAndTransport = travelAndTransport;
    this.shopsAndServices = shopsAndServices;
    this.nightlife = nightlife;
    //lowest rank has the highest feature value in database. We are transforming the rank to match with our
    // critiquing UI, where lowest value has the lowest rank
    this.averageTemperatureRank = 181 - averageTemperatureRank;
    this.costOfLivingIndexRank = 181 - costOfLivingIndexRank;
    this.foodRank = 181 - foodRank;
    this.artsAndEntertainmentRank = 181 - artsAndEntertainmentRank;
    this.outdoorsAndRecreationRank = 181 - outdoorsAndRecreationRank;
    this.travelAndTransportRank = 181 - travelAndTransportRank;
    this.shopsAndServicesRank = 181 - shopsAndServicesRank;
    this.nightlifeRank = 181 - nightlifeRank;
    this.distance = distance;
    this.currentRecommendation = false;
    this.critiquingCity = false;
  }

  static parse = data => {
    const city = new City({
      id: data._id,
      name: data.name,
      country: data.country,
      pictureUrl: data.pictureUrl !== 'NaN' ? data.pictureUrl : 'https://source.unsplash.com/aExT3y92x5o/500x300',
      climateType: climateTypeToName[data.climateType],
      averageTemperature: data.averageTemperature,
      costOfLivingIndexBin: data.costOfLivingIndexBin,
      food: data.foodScaled,
      artsAndEntertainment: data.artsAndEntertainmentScaled,
      outdoorsAndRecreation: data.outdoorsAndRecreationScaled,
      travelAndTransport: data.travelAndTransportScaled,
      shopsAndServices: data.shopsAndServicesScaled,
      nightlife: data.nightlifeScaled,
      averageTemperatureRank: data.averageTemperatureRank,
      costOfLivingIndexRank: data.costOfLivingIndexRank,
      foodRank: data.foodRank,
      artsAndEntertainmentRank: data.artsAndEntertainmentRank,
      outdoorsAndRecreationRank: data.outdoorsAndRecreationRank,
      travelAndTransportRank: data.travelAndTransportRank,
      shopsAndServicesRank: data.shopsAndServicesRank,
      nightlifeRank: data.nightlifeRank,
      averagePrecipitationRank: data.averagePrecipitationRank,
      distance: data.distance
    });
    
    return city;
  }
}

export default City;