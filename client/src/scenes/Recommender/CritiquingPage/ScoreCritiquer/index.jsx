import React from 'react'
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import ReactTooltip from 'react-tooltip'
import Spinner from "../../../../components/Spinner";

const Slider = styled.div.attrs(() => ({
  className: 'row'
}))`
  border: thin solid #d3d3dc;
  border-radius: 5px;
  margin-right: 0px !important;
  margin-left: 0px !important;
  margin-bottom: 8px;
  background-color: white;
  padding: 10px;
  width: 1100px;
`;

const StyledLabel = styled.label`
    font-size: 11.75px;
    transform: rotate(30deg);
    width: 125px;
    text-align: left;
    margin-top: 50px;
    margin-left: -10px;
`;

const StyledInput= styled.input`
    float:left;
    margin-left: 3px;
    margin-right: 3px;
    margin-top: 5px;
`;

const FeatureLabelDiv= styled.div`
    width: 160px;
    text-align: left;
`;

const StatsDiv= styled.div`
    margin-bottom: 10px;
    background-color: white;
`;

const FeatureRankDiv= styled.div`
    font-size: 15px;
    margin-top: 5px;
`;

const FeatureLabel= styled.span`
    background-color: #5187ce;
    padding: 6px;
    color: white;
    border-radius: 7px;
    font-size: 13px;
`;

const CityOption = styled.div.attrs(() => ({
    className: 'column'
  }
))`
    margin-right: -115px;
    color: #a2a5a9;
`;

const RecommendedCityOption = styled.div.attrs(() => ({
    className: 'column'
  }
))`
    margin-right: -115px;
    color: #000000;
`;

const Dot = styled.div.attrs(() => ({
    className: 'column'
  }
))`
`;

class ScoreCritiquer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldFlash: true,
      critiquingCycle: 0
    };
  }


  static getDerivedStateFromProps(props, state) {
    let recommendedCity = props.cities.find(({currentRecommendation}) => currentRecommendation === true);

    if (typeof recommendedCity !== 'undefined') {
      if (typeof state.recommendedCity === 'undefined'){
        return { shouldFlash: true,
          recommendedCity: recommendedCity,
          critiquedCity: recommendedCity
        };
      }
      if (recommendedCity.id !== state.recommendedCity.id){
        let critiquingCycle = state.critiquingCycle;

        return { shouldFlash: true,
          recommendedCity: recommendedCity,
          critiquedCity: recommendedCity,
          critiquingCycle: critiquingCycle + 1
        };
      }
      return null;
    }
    return null;
  }

  setFoodSelected = (i) => {
     let refVal = "food"+i;
    ReactDOM.findDOMNode(this.refs[refVal]).checked = true;
  }

  setArtsSelected = (i) => {
    let refVal = "arts"+i;
    ReactDOM.findDOMNode(this.refs[refVal]).checked = true;
  }

  setOutdoorSelected = (i) => {
    let refVal = "outdoor"+i;
    ReactDOM.findDOMNode(this.refs[refVal]).checked = true;
  }

  setTravelSelected = (i) => {
    let refVal = "travel"+i;
    ReactDOM.findDOMNode(this.refs[refVal]).checked = true;
  }

  setTemperatureSelected = (i) => {
    let refVal = "temperature"+i;
    ReactDOM.findDOMNode(this.refs[refVal]).checked = true;
  }

  setCostSelected = (i) => {
    let refVal = "cost"+i;
    ReactDOM.findDOMNode(this.refs[refVal]).checked = true;
  }

  setNightlifeSelected = (i) => {
    let refVal = "nightlife"+i;
    ReactDOM.findDOMNode(this.refs[refVal]).checked = true;
  }

  setShopsSelected = (i) => {
    let refVal = "shop"+i;
    ReactDOM.findDOMNode(this.refs[refVal]).checked = true;
  }

  handleNightlifeClick = (i, feature) => {
    const { cities } = this.props;

    let critiquedCity = cities.find(({nightlifeRank}) => nightlifeRank === i);
    this.selectOtherFeatures(critiquedCity, feature);
  }

  handleArtsClick = (i, feature) => {
    const { cities } = this.props;

    let critiquedCity = cities.find(({artsAndEntertainmentRank}) => artsAndEntertainmentRank === i);
    this.selectOtherFeatures(critiquedCity, feature);
  }

  handleFoodClick = (i, feature) => {
    const { cities } = this.props;

    let critiquedCity = cities.find(({foodRank}) => foodRank === i);
    this.selectOtherFeatures(critiquedCity, feature);
  }

  handleShopsClick = (i, feature) => {
    const { cities } = this.props;

    let critiquedCity = cities.find(({shopsAndServicesRank}) => shopsAndServicesRank === i);
    this.selectOtherFeatures(critiquedCity, feature);
  }

  handleTravelClick = (i, feature) => {
    const { cities } = this.props;

    let critiquedCity = cities.find(({travelAndTransportRank}) => travelAndTransportRank === i);
    this.selectOtherFeatures(critiquedCity, feature);
  }

  handleOutdoorClick = (i, feature) => {
    const { cities } = this.props;

    let critiquedCity = cities.find(({outdoorsAndRecreationRank}) => outdoorsAndRecreationRank === i);
    this.selectOtherFeatures(critiquedCity, feature);
  }

  handleCostClick = (i, feature) => {
    const { cities } = this.props;

    let critiquedCity = cities.find(({costOfLivingIndexRank}) => costOfLivingIndexRank === i);
    this.selectOtherFeatures(critiquedCity, feature);
  }

  handleTemperatureClick = (i, feature) => {
    const { cities } = this.props;

    let critiquedCity = cities.find(({averageTemperatureRank}) => averageTemperatureRank === i);
    this.selectOtherFeatures(critiquedCity, feature);
  }

  selectOtherFeatures = (critiquedCity, feature) => {
    let recommendedCity = this.props.cities.find(({currentRecommendation}) => currentRecommendation === true);
    this.setState({critiquedCity: critiquedCity});
    this.setState({recommendedCity: recommendedCity});

      this.setFoodSelected(critiquedCity.foodRank);

      this.setArtsSelected(critiquedCity.artsAndEntertainmentRank);

      this.setOutdoorSelected(critiquedCity.outdoorsAndRecreationRank);

      // this.setShopsSelected(critiquedCity.shopsAndServicesRank);

      // this.setTravelSelected(critiquedCity.travelAndTransportRank);

      this.setNightlifeSelected(critiquedCity.nightlifeRank);

      this.setCostSelected(critiquedCity.costOfLivingIndexRank);

      this.setTemperatureSelected(critiquedCity.averageTemperatureRank);
  };

  getStyle = (i, feature) => {
    let recommendedCity = this.state.recommendedCity;
    let critiquedCity = this.state.critiquedCity;

    if (critiquedCity === null){
      return {"background-color": "#FFFFFF"};
    }

    if (i < recommendedCity[feature] && i > critiquedCity[feature]) {
      return {"background-color": "#fab1a0", "height": "13px"};
    }

    if (i < critiquedCity[feature] && i > recommendedCity[feature]) {
      return {"background-color": "#88D68F", "height": "13px"};
    }

    return {"background-color": "#FFFFFF"};
  }


  getStyleLabel = (i, feature) => {
    let critiquedCity = this.state.critiquedCity;

    if (critiquedCity === null){
      return {"color": "#a2a5a9"};
    }

    if (i === critiquedCity[feature]) {
      return {"color": "#6B7476"};
    }

    return {"color": "#a2a5a9"};
  };

  onContinueClick = () => {
    if (this.state.recommendedCity.id === this.state.critiquedCity.id) {
      this.props.onFinish();
    }
    else {
      this.props.onCritiqueClick([this.state.critiquedCity.id]);
    }
  };

  render() {
    const { cities, statistics, isLoading } = this.props;
    let recommendedCity = this.props.cities.find(({currentRecommendation}) => currentRecommendation === true);
    let critiquedCity = this.state.critiquedCity;

    let nightlifeRank = cities.map(a => {
      let rObj = {};
      rObj.id = a.nightlifeRank;
      rObj.name = a.name;
      return rObj;
    });

    let foodRank = cities.map(a => {
      let rObj = {};
      rObj.id = a.foodRank;
      rObj.name = a.name;
      return rObj;
    });

    let averageTemperatureRank = cities.map(a => {
      let rObj = {};
      rObj.id = a.averageTemperatureRank;
      rObj.name = a.name;
      return rObj;
    });

    let costRank = cities.map(a => {
      let rObj = {};
      rObj.id= a.costOfLivingIndexRank;
      rObj.name = a.name;
      return rObj;
    });

    let outdoorsAndRecreationRank = cities.map(a => {
      let rObj = {};
      rObj.id = a.outdoorsAndRecreationRank;
      rObj.name = a.name;
      return rObj;
    });

    let travelAndTransportRank = cities.map(a => {
      let rObj = {};
      rObj.id = a.travelAndTransportRank;
      rObj.name = a.name;
      return rObj;
    });

    let shopsAndServicesRank = cities.map(a => {
      let rObj = {};
      rObj.id= a.shopsAndServicesRank;
      rObj.name = a.name;
      return rObj;
    });

    let artsAndEntertainmentRank = cities.map(a => {
      let rObj = {};
      rObj.id = a.artsAndEntertainmentRank;
      rObj.name = a.name;
      return rObj;
    });

    const getSelectedRankNightlife = (i) => {
      if (recommendedCity.nightlifeRank === i) {
        return <RecommendedCityOption key={i} index={i} id={"nightlife"+i} style={this.getStyle(i, "nightlifeRank")}><StyledInput type="radio" name="nightlife" ref={"nightlife"+i} checked={recommendedCity.id === critiquedCity.id} onClick={() => this.handleNightlifeClick(i, "nightlife")}/><StyledLabel>{recommendedCity.name}</StyledLabel></RecommendedCityOption>;
      }
      let cityForIndex = nightlifeRank.find(({id}) => id === i);
      if (cityForIndex){
        return <CityOption key={i} index={i} id={"nightlife"+i} style={this.getStyle(i, "nightlifeRank")}><StyledInput type="radio" name="nightlife" ref={"nightlife"+i} onClick={() => this.handleNightlifeClick(i, "nightlife")}/><StyledLabel style={this.getStyleLabel(i, "nightlifeRank")}>{cityForIndex.name}</StyledLabel></CityOption>;
      }
      else{
        return <Dot key={i} index={i} ref={"nightlife"+i} style={this.getStyle(i, "nightlifeRank")}>.</Dot>;
      }
    };

    const getPlaceHolderNightlife = (i) => {
      if (recommendedCity.nightlifeRank === i) {
        return <RecommendedCityOption key={i} index={i} id={"nightlife"+i} style={this.getStyle(i, "nightlifeRank")}><StyledInput type="radio" name="nightlife" ref={"nightlife"+i} checked={recommendedCity.id === critiquedCity.id} onClick={() => this.handleNightlifeClick(i, "nightlife")}/><StyledLabel>{recommendedCity.name}</StyledLabel></RecommendedCityOption>;
      }
      let cityForIndex = nightlifeRank.find(({id}) => id === i);
      if (cityForIndex){
        return <CityOption key={i} index={i} id={"nightlife"+i} style={this.getStyle(i, "nightlifeRank")}><StyledInput type="radio" name="nightlife" ref={"nightlife"+i} onClick={() => this.handleNightlifeClick(i, "nightlife")}/><StyledLabel style={this.getStyleLabel(i, "nightlifeRank")}>{cityForIndex.name}</StyledLabel></CityOption>;
      }
      else{
        return <Dot key={i} index={i} ref={"nightlife"+i} style={this.getStyle(i, "nightlifeRank")}>.</Dot>;
      }
    };

    const getPlaceHolderFood = (i) => {
      if (recommendedCity.foodRank === i) {
        return <RecommendedCityOption key={i} index={i} id={"food"+i} style={this.getStyle(i, "foodRank")}><StyledInput type="radio" name="food" ref={"food"+i} checked={recommendedCity.id === critiquedCity.id} onClick={() => this.handleFoodClick(i, "food")}/><StyledLabel>{recommendedCity.name}</StyledLabel></RecommendedCityOption>;
      }
      let cityForIndex = foodRank.find(({id}) => id === i);
      if (cityForIndex){
        return <CityOption key={i} index={i} id={"food"+i} style={this.getStyle(i, "foodRank")}><StyledInput type="radio" name="food" ref={"food"+i} onClick={() => this.handleFoodClick(i, "food")}/><StyledLabel style={this.getStyleLabel(i, "foodRank")}>{cityForIndex.name}</StyledLabel></CityOption>;
      }
      else{
        return <Dot key={i} index={i} ref={"food"+i} style={this.getStyle(i, "foodRank")}>.</Dot>;
      }
    };

    const getPlaceHolderCost = (i) => {
      if (recommendedCity.costOfLivingIndexRank === i) {
        return <RecommendedCityOption key={i} index={i} id={"cost"+i} style={this.getStyle(i, "costOfLivingIndexRank")}><StyledInput type="radio" name="cost" ref={"cost"+i} checked={recommendedCity.id === critiquedCity.id} onClick={() => this.handleCostClick(i, "cost")}/><StyledLabel>{recommendedCity.name}</StyledLabel></RecommendedCityOption>;
      }
      let cityForIndex = costRank.find(({id}) => id === i);
      if (cityForIndex){
        return <CityOption key={i} index={i} id={"cost"+i} style={this.getStyle(i, "costOfLivingIndexRank")}><StyledInput type="radio" name="cost" ref={"cost"+i}  onClick={() => this.handleCostClick(i, "cost")}/><StyledLabel style={this.getStyleLabel(i, "costOfLivingIndexRank")}>{cityForIndex.name}</StyledLabel></CityOption>;
      }
      else{
        return <Dot key={i} index={i} ref={"cost"+i} style={this.getStyle(i, "costOfLivingIndexRank")}>.</Dot>;
      }
    };

    const getPlaceHolderArtsAndEntertainment = (i) => {
      if (recommendedCity.artsAndEntertainmentRank === i) {
        return <RecommendedCityOption key={i} index={i} id={"arts"+i} style={this.getStyle(i, "artsAndEntertainmentRank")}><StyledInput type="radio" name="arts" ref={"arts"+i} checked={recommendedCity.id === critiquedCity.id} onClick={() => this.handleArtsClick(i, "arts")}/><StyledLabel>{recommendedCity.name}</StyledLabel></RecommendedCityOption>;
      }
      let cityForIndex = artsAndEntertainmentRank.find(({id}) => id === i);
      if (cityForIndex){
        return <CityOption key={i} index={i} id={"arts"+i} style={this.getStyle(i, "artsAndEntertainmentRank")}><StyledInput type="radio" name="arts" ref={"arts"+i} onClick={() => this.handleArtsClick(i, "arts")}/><StyledLabel style={this.getStyleLabel(i, "artsAndEntertainmentRank")}>{cityForIndex.name}</StyledLabel></CityOption>;
      }
      else{
        return <Dot key={i} index={i} ref={"arts"+i} style={this.getStyle(i, "artsAndEntertainmentRank")}>.</Dot>;
      }
    };

    const getPlaceHolderOutdoorAndRecreations = (i) => {
      if (recommendedCity.outdoorsAndRecreationRank === i) {
        return <RecommendedCityOption key={i} index={i} id={"outdoor"+i} style={this.getStyle(i, "outdoorsAndRecreationRank")}><StyledInput type="radio" name="outdoor" ref={"outdoor"+i} checked={recommendedCity.id === critiquedCity.id} onClick={() => this.handleOutdoorClick(i, "outdoor")}/><StyledLabel >{recommendedCity.name}</StyledLabel></RecommendedCityOption>;
      }
      let cityForIndex = outdoorsAndRecreationRank.find(({id}) => id === i);
      if (cityForIndex){
        return <CityOption key={i} index={i} id={"outdoor"+i} style={this.getStyle(i, "outdoorsAndRecreationRank")}><StyledInput type="radio" name="outdoor" ref={"outdoor"+i} onClick={() => this.handleOutdoorClick(i, "outdoor")}/><StyledLabel style={this.getStyleLabel(i, "outdoorsAndRecreationRank")}>{cityForIndex.name}</StyledLabel></CityOption>;
      }
      else{
        return <Dot key={i} index={i} ref={"outdoor"+i} style={this.getStyle(i, "outdoorsAndRecreationRank")}>.</Dot>;
      }
    };

    const getPlaceHolderTravelAndTransport = (i) => {
      if (recommendedCity.travelAndTransportRank === i) {
        return <RecommendedCityOption key={i} index={i} id={"travel"+i} style={this.getStyle(i, "travelAndTransportRank")}><StyledInput type="radio" name="travel" ref={"travel"+i} checked={recommendedCity.id === critiquedCity.id} onClick={() => this.handleTravelClick(i, "travel")}/><StyledLabel>{recommendedCity.name}</StyledLabel></RecommendedCityOption>;
      }
      let cityForIndex = travelAndTransportRank.find(({id}) => id === i);
      if (cityForIndex){
        return <CityOption key={i} index={i} id={"travel"+i} style={this.getStyle(i, "travelAndTransportRank")}><StyledInput type="radio" name="travel" ref={"travel"+i} onClick={() => this.handleTravelClick(i, "travel")}/><StyledLabel style={this.getStyleLabel(i, "travelAndTransportRank")}>{cityForIndex.name}</StyledLabel></CityOption>;
      }
      else{
        return <Dot key={i} index={i} ref={"travel"+i} style={this.getStyle(i, "travelAndTransportRank")}>.</Dot>;
      }
    };

    const getPlaceHolderShopsAndService = (i) => {
      if (recommendedCity.shopsAndServicesRank === i) {
        return <RecommendedCityOption key={i} index={i} id={"shop"+i} style={this.getStyle(i, "shopsAndServicesRank")}><StyledInput type="radio" name="shop" ref={"shop"+i} checked={recommendedCity.id === critiquedCity.id} onClick={() => this.handleShopsClick(i, "shop")}/><StyledLabel>{recommendedCity.name}</StyledLabel></RecommendedCityOption>;
      }
      let cityForIndex = shopsAndServicesRank.find(({id}) => id === i);
      if (cityForIndex){
        return <CityOption key={i} index={i} id={"shop"+i} style={this.getStyle(i, "shopsAndServicesRank")}><StyledInput type="radio" name="shop" ref={"shop"+i} onClick={() => this.handleShopsClick(i, "shop")}/><StyledLabel style={this.getStyleLabel(i, "shopsAndServicesRank")}>{cityForIndex.name}</StyledLabel></CityOption>;
      }
      else{
        return <Dot key={i} index={i} ref={"shop"+i} style={this.getStyle(i, "shopsAndServicesRank")}>.</Dot>;
      }
    };

    const getPlaceHolderAverageTemperature = (i) => {
      if (recommendedCity.averageTemperatureRank === i) {
        return <RecommendedCityOption key={i} index={i} id={"temperature"+i} style={this.getStyle(i, "averageTemperatureRank")}><StyledInput type="radio" name="temperature" ref={"temperature"+i} checked={recommendedCity.id === critiquedCity.id} onClick={() => this.handleTemperatureClick(i, "temperature")}/><StyledLabel>{recommendedCity.name}</StyledLabel></RecommendedCityOption>;
      }
      let cityForIndex = averageTemperatureRank.find(({id}) => id === i);
      if (cityForIndex){
        return <CityOption key={i} index={i} id={"temperature"+i} style={this.getStyle(i, "averageTemperatureRank")}><StyledInput type="radio" name="temperature" ref={"temperature"+i} onClick={() => this.handleTemperatureClick(i, "temperature")}/><StyledLabel style={this.getStyleLabel(i, "averageTemperatureRank")}>{cityForIndex.name}</StyledLabel></CityOption>;
      }
      else{
        return <Dot key={i} index={i} ref={"temperature"+i} style={this.getStyle(i, "averageTemperatureRank")}>.</Dot>;
      }
    };

    let buttonText = "Select";
    let toolTipText = "This was our initial recommendation for you. You can select `" + recommendedCity.name + "`" +
      " below again";
    let differentCitiesSelected = false;
    if (this.state.recommendedCity.id !== this.state.critiquedCity.id){
      buttonText = "Continue with";
      differentCitiesSelected = true;
    }
    var rows = [], i = 0, len = 180;

    while (++i <= len) rows.push(i);
    return (
      isLoading ? <Spinner/> :
      <div style={{'margin': '0 auto'}} ref="main">
        <div className="column" style={{'position': 'sticky', 'top': '0', 'height': '85px', 'background-color': '#f2f3f7', 'margin': 'auto 0', 'z-index': '10'}}>
          <div style={{'marginBottom': '10px'}}>You can also compare and choose different cities below with the current recommendation</div>
          <div className="row" style={{'display': 'inline-block'}}>

            {
              differentCitiesSelected ?
                <div>
                  <ReactTooltip place="top" type="dark" effect="solid"/>
                  <span data-tip={toolTipText}><button style={{'font-weight': '600', 'border-radius': '0px', 'text-decoration':'line-through', 'marginRight': '5px'}} disabled={true}>{recommendedCity.name}</button></span>
                  <button style={{'background-color': '#474bde', 'color': 'white', 'font-weight': '600', 'border-radius': '5px'}} onClick={() => this.onContinueClick()}>{buttonText} {critiquedCity.name}</button>
                </div>
                :
                <div>
                  <button style={{'background-color': '#474bde', 'color': 'white', 'font-weight': '600', 'border-radius': '5px'}} onClick={() => this.onContinueClick()}>{buttonText} {critiquedCity.name}</button>
                </div>
            }

          </div>
        </div>
          <Slider>
          <FeatureLabelDiv>
            <FeatureLabel>Nightlife</FeatureLabel><FeatureRankDiv>{"Rank "}{critiquedCity.nightlifeRank}{"/180"}</FeatureRankDiv></FeatureLabelDiv>
          {rows.map(function (i) {
            return getPlaceHolderNightlife(i);
          })}
        </Slider>
      <Slider>
        <FeatureLabelDiv><FeatureLabel>Food</FeatureLabel><FeatureRankDiv>{"Rank "}{critiquedCity.foodRank}{"/180"}</FeatureRankDiv></FeatureLabelDiv>
      {rows.map(function (i) {
          return getPlaceHolderFood(i);
        })}
      </Slider>
        <Slider>
          <FeatureLabelDiv><FeatureLabel>Arts & Entertainment</FeatureLabel><FeatureRankDiv>{"Rank "}{critiquedCity.artsAndEntertainmentRank}{"/180"}</FeatureRankDiv></FeatureLabelDiv>
          {rows.map(function (i) {
            return getPlaceHolderArtsAndEntertainment(i);
          })}
        </Slider>
        <Slider>
          <FeatureLabelDiv><FeatureLabel>Outdoor & Recreation</FeatureLabel><FeatureRankDiv>{"Rank "}{critiquedCity.outdoorsAndRecreationRank}{"/180"}</FeatureRankDiv></FeatureLabelDiv>
          {rows.map(function (i) {
            return getPlaceHolderOutdoorAndRecreations(i);
          })}
        </Slider>
        <Slider>
          <FeatureLabelDiv><FeatureLabel>Average Temperature</FeatureLabel><FeatureRankDiv>{"Rank "}{critiquedCity.averageTemperatureRank}{"/180"}</FeatureRankDiv></FeatureLabelDiv>
          {rows.map(function (i) {
            return getPlaceHolderAverageTemperature(i);
          })}
        </Slider>
        <Slider>
          <FeatureLabelDiv><FeatureLabel>Cost</FeatureLabel><FeatureRankDiv>{"Rank "}{critiquedCity.costOfLivingIndexRank}{"/180"}</FeatureRankDiv></FeatureLabelDiv>
          {rows.map(function (i) {
            return getPlaceHolderCost(i);
          })}
        </Slider>
        {/*<StatsDiv>{JSON.stringify(statistics.nightlife, null, 2)}</StatsDiv>*/}
        {/*<StatsDiv>{JSON.stringify(statistics.food, null, 2)}</StatsDiv>*/}
        {/*<StatsDiv>{JSON.stringify(statistics.arts, null, 2)}</StatsDiv>*/}
        {/*<StatsDiv>{JSON.stringify(statistics.outdoor, null, 2)}</StatsDiv>*/}
        {/*<StatsDiv>{JSON.stringify(statistics.temperature, null, 2)}</StatsDiv>*/}
        {/*<StatsDiv>{JSON.stringify(statistics.cost, null, 2)}</StatsDiv>*/}
        {/*<StatsDiv>{"Number of Iterations "}{JSON.stringify(statistics.noOfIterations)}</StatsDiv>*/}
    </div>
    );
  }
}

export default ScoreCritiquer;