import React from 'react';
import { StandardRow } from '../../../CommonStyles';
import { CenteredContainer, BannerWithMargin } from '../styles';
import Spinner from '../../../components/Spinner';
import ReactTooltip from 'react-tooltip';
import ScoreRefiner from './ScoreRefiner';
import styled from 'styled-components';
import HoverInfoIndicator from '../../../components/HoverInfoIndicator';
import CityDetailsPane from "../FinalRecommendationPage/CityDetailsPane";

const NextQuestionButton = styled.button`
  background-color: ${p => p.isDisabled ? 'transparent' : 'white'};
  transition: all 200ms ease-in-out;
  font-size: 10px;
  font-weight: 700;
  padding: 6px 17px;
  letter-spacing: 2.8px;
  color: ${p => p.theme.secondaryText};
  border: 1px solid ${p => p.theme.secondaryText}80;
  margin-top: 10px;
  border-radius: 100px;
  cursor: pointer;
  text-transform: uppercase;
  margin-bottom: 10px;
  pointer-events: ${p => p.isDisabled ? 'none' : 'all'};

  &, :hover, :focus, :active {
    outline: none;
  }

  &:hover {
    background-color: ${p => p.theme.primary};
    color: white;
  }
`;

const Refiner =  styled.div.attrs(() => ({
    className: 'offset-md-1 col-md-10 col-sm-12'
  }
))`
  background-color: white;
  margin-bottom: 15px;
`;

const aspects = [
  {
    aspectName: 'price level',
    aspectCodeName: 'cost',
  },
  {
    aspectName: 'average temperature',
    aspectCodeName: 'temperature',
  },
  {
    aspectName: 'food',
    aspectCodeName: 'food',
  },
  {
    aspectName: 'arts and entertainment',
    aspectCodeName: 'arts',
  },
  {
    aspectName: 'outdoors and recreation',
    aspectCodeName: 'outdoors',
  },
  {
    aspectName: 'nightlife',
    aspectCodeName: 'nightlife',
  }
];

const possibleAspectValues = new Set([-2, -1, 0, 1, 2]);

class RefiningPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentAspectIndex: 0
    }
  }

  componentDidMount() {
    const { shouldResetRecommenderProgress, resetRecommenderProgress } = this.props;
    if (shouldResetRecommenderProgress()) {
      resetRecommenderProgress();
    }
  }

  disableNextButton = (refinements) => {
    let anyMatch = aspects.find(aspect =>
      !possibleAspectValues.has(refinements[aspect.aspectCodeName])
    );

    return !!anyMatch;
  };

  render() {
    const { cities, refinements, isLoading, handleRefinementAction, onNextStepClick, onCritiqueClick } = this.props;
    const { currentAspectIndex } = this.state;
    //  let cities;
    // if (typeof citiesParam === 'undefined' || citiesParam.length === 0){
    //   cities = [{currentRecommendation: true, name: ''}];
    // } else {
    //   cities = citiesParam;
    // }

    // let toolTipText = 'Please select a value for all aspects above';
    //
    // let buttonText = "Select";
    // let buttonTipText = "This was our initial recommendation for you. You can select `" + cities[0].name + "`" +
    //   " below again";
    // let differentCitiesSelected = false;

    return (
      <CenteredContainer>
        <BannerWithMargin margin={15}>Please check out the initial recommendations below and provide some feedback!</BannerWithMargin>

        <StandardRow>
          <HoverInfoIndicator>In this step, your feedback helps us better tune our understanding of what you prefer. Please check out the initial recommendations below and rate how well each aspect fits your preferences!</HoverInfoIndicator>
        </StandardRow>

        {isLoading
          ? <Spinner />
          : <CityDetailsPane city={cities[0] || {}}  maxSimilarity={10} isLoading={isLoading} />
        }
        <div style={{'margin': '10px', 'marginTop': '20px'}}>How did you find the below aspects of the recommendation ?</div>
        <button style={{'background-color': '#474bde', 'color': 'white', 'font-weight': '600', 'border-radius': '5px'}} onClick={() => onCritiqueClick(false)}>Continue</button>

        {/*{*/}
        {/*  this.disableNextButton(refinements) ?*/}
        {/*    <div>*/}
        {/*      <ReactTooltip place="top" type="dark" effect="solid"/>*/}
        {/*      <span data-tip={buttonTipText}><button style={{'font-weight': '600', 'border-radius': '0px', 'text-decoration':'line-through', 'marginRight': '5px'}} disabled={true}>{cities[0].name}</button></span>*/}
        {/*      <button style={{'background-color': '#474bde', 'color': 'white', 'font-weight': '600', 'border-radius': '5px'}} onClick={() => onCritiqueClick()}>{buttonText} {cities[0].name}</button>*/}
        {/*    </div>*/}
        {/*    :*/}
        {/*    <div>*/}
        {/*      <button style={{'background-color': '#474bde', 'color': 'white', 'font-weight': '600', 'border-radius': '5px'}} onClick={() => onCritiqueClick()}>{buttonText} {cities[0].name}</button>*/}
        {/*    </div>*/}
        {/*}*/}

        <Refiner>
          <ScoreRefiner
            aspectName={aspects[0].aspectName}
            aspectCodeName={aspects[0].aspectCodeName}
            handleRefinementAction={handleRefinementAction}
            selectedValue={refinements[aspects[0].aspectCodeName]}
          />
        </Refiner>
        <Refiner>
          <ScoreRefiner
            aspectName={aspects[1].aspectName}
            aspectCodeName={aspects[1].aspectCodeName}
            handleRefinementAction={handleRefinementAction}
            selectedValue={refinements[aspects[1].aspectCodeName]}
          />
        </Refiner>
        <Refiner>
          <ScoreRefiner
            aspectName={aspects[2].aspectName}
            aspectCodeName={aspects[2].aspectCodeName}
            handleRefinementAction={handleRefinementAction}
            selectedValue={refinements[aspects[2].aspectCodeName]}
          />
        </Refiner>
        <Refiner>
          <ScoreRefiner
            aspectName={aspects[3].aspectName}
            aspectCodeName={aspects[3].aspectCodeName}
            handleRefinementAction={handleRefinementAction}
            selectedValue={refinements[aspects[3].aspectCodeName]}
          />
        </Refiner>
        <Refiner>
          <ScoreRefiner
            aspectName={aspects[4].aspectName}
            aspectCodeName={aspects[4].aspectCodeName}
            handleRefinementAction={handleRefinementAction}
            selectedValue={refinements[aspects[4].aspectCodeName]}
          />
        </Refiner>
        <Refiner>
          <ScoreRefiner
            aspectName={aspects[5].aspectName}
            aspectCodeName={aspects[5].aspectCodeName}
            handleRefinementAction={handleRefinementAction}
            selectedValue={refinements[aspects[5].aspectCodeName]}
          />
        </Refiner>
        {/*{*/}
        {/*  this.disableNextButton(refinements) ?*/}
        {/*    <div>*/}
        {/*      <ReactTooltip place="top" type="dark" effect="solid"/>*/}
        {/*      <span data-tip={toolTipText}>*/}
        {/*      <NextQuestionButton isDisabled={true} onClick={onNextStepClick}>*/}
        {/*        go to next step*/}
        {/*      </NextQuestionButton>*/}
        {/*      </span>*/}
        {/*    </div>*/}
        {/*  :*/}
        {/*    <div>*/}
        {/*      <NextQuestionButton isDisabled={false} onClick={onNextStepClick}>*/}
        {/*        go to next step*/}
        {/*      </NextQuestionButton>*/}
        {/*    </div>*/}
        {/*}*/}
      </CenteredContainer>
    );
  }
}

export default RefiningPage;