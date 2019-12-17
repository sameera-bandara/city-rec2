import React from 'react';
import { CenteredContainer } from '../styles';
import ScoreCritiquer from './ScoreCritiquer';
import CityDetailsPane from "../CritiquingPage/CityDetailsPane";


class CritiquingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentAspectIndex: 0
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const { shouldResetRecommenderProgress, resetRecommenderProgress } = this.props;
    if (shouldResetRecommenderProgress()) {
      resetRecommenderProgress();
    }
    this.scroll(this.myRef);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.scroll(this.myRef);
  }

  scroll(ref) {
    ref.current.scrollTo(0, 0);
  }

  render() {
    const { cities, statistics, isLoading, onNextStepClick, onCritiqueClick } = this.props;

    let critiques = [];

    if (typeof cities === 'undefined' || cities.length === 0){
      critiques = [{currentRecommendation: true, name: ''}];
    }
    else{
      critiques = cities;
    }
    return (
      <div ref={this.myRef}>
      <CenteredContainer>
          <CityDetailsPane city={cities[0] || {}}  maxSimilarity={10} isLoading={isLoading}/>
          <div className="row" style={{'marginTop': '30px'}}><ScoreCritiquer cities={critiques} statistics={statistics || {}} onFinish={onNextStepClick} onCritiqueClick={onCritiqueClick} isLoading={isLoading}/></div>
      </CenteredContainer>
      </div>
    );
  }
}

export default CritiquingPage;