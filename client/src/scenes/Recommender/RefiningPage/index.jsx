import React from 'react';
import { StandardRow } from '../../../CommonStyles';
import { CenteredContainer, BannerWithMargin } from '../styles';
import Spinner from '../../../components/Spinner';
import ReactTooltip from 'react-tooltip';
import ScoreRefiner from './ScoreRefiner';
import styled from 'styled-components';
import HoverInfoIndicator from '../../../components/HoverInfoIndicator';
import CityDetailsPane from "../FinalRecommendationPage/CityDetailsPane";

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

    let buttonTipText = "Select this city and finish recommendation";
    let disabledContinueText = "Please select values for below aspects";
    let continueText = "Continue recommendation with adjustments to the feature values";

    return (
      <CenteredContainer>
        <BannerWithMargin margin={15}>Please check out the initial recommendations below and provide some feedback!</BannerWithMargin>

        <StandardRow>
          <HoverInfoIndicator>In this step, your feedback helps us better tune our understanding of what you prefer. Please check out the initial recommendations below and rate how well each aspect fits your preferences!</HoverInfoIndicator>
        </StandardRow>

        {isLoading
          ? <Spinner/>
          : <CityDetailsPane city={cities[0] || {}}  maxSimilarity={10} isLoading={isLoading} />
        }
        <div style={{'margin': '10px', 'marginTop': '20px'}}>How did you find the below aspects of the recommendation ?</div>
        <ReactTooltip place="top" type="dark" effect="solid"/>

        {
          this.disableNextButton(refinements) ?
            <div>
              <span data-tip={buttonTipText}><button style={{'background-color': '#474bde', 'color': 'white', 'font-weight': '600', 'border-radius': '5px', 'margin': '5px'}} onClick={() => onNextStepClick()}>Select</button></span>
              <span data-tip={disabledContinueText}><button style={{'font-weight': '600', 'border-radius': '0px', 'text-decoration':'line-through', 'marginRight': '5px'}} onClick={() => onCritiqueClick(false)} disabled={true}>Continue with Adjustments</button></span>
            </div>
            :
            <div>
              <span data-tip={buttonTipText}><button style={{'background-color': '#474bde', 'color': 'white', 'font-weight': '600', 'border-radius': '5px', 'margin': '5px'}} onClick={() => onNextStepClick()}>Select</button></span>
              <span data-tip={continueText}><button style={{'background-color': '#474bde', 'color': 'white', 'font-weight': '600', 'border-radius': '5px'}} onClick={() => onCritiqueClick(false)}>Continue with Adjustments</button></span>
            </div>
        }

        {isLoading ?
        <Spinner/> :
          <div>
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
          </div>
        }
      </CenteredContainer>
    );
  }
}

export default RefiningPage;