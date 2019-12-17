import React from 'react';
import styled from 'styled-components'
import { ModifiedCard } from '../styles';
import {CardHead, SerifBullet} from '../../../../CommonStyles';
import InfoBullet from '../../../../components/InfoBullet';
import CostIndicator from '../../../../components/CostIndicator';
import MatchLevelIndicator from '../../../../components/MatchLevelIndicator';
import { ProgressBarWithMargin, TemperatureField } from '../../styles';

const MAP_KEY = 'Nbx46lwGXYYiagLOQyuAM8Y9PHBimLAn'

const Container = styled(ModifiedCard)`
  min-height: 350px;
  max-width: 400px;
  margin: 0 auto;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  cursor: auto;
`;

const RichContentContainer = styled.div`
  width: 100%;
  display: inline-flex;
  flex-grow: 1;
  margin-bottom: 10px;

  > div#image {
    background-color: ${p => p.theme.lightblue};
    background-image: url(${p => p.pictureUrl});
    background-size: cover;
    background-position: center; 
    width: 30%;
    min-height: 100%;
    margin-right: 10px;
    border-radius: 2px;
  }

  > div#map {
    background-image: url(${p => p.mapUrl});
    background-color: ${p => p.theme.lightblue};
    background-size: cover;
    background-position: center; 
    width: 50%;
    min-height: 100%;
    border-radius: 2px;
    display: block;
  }

  @media (max-width: 576px) {
    > div#image {
      width: 50%;      
    }
    > div#map {
      width: 50%;      
    }
  }
`;

const DetailsContainer = styled.div`
  width: 100%;
  display: inline-flex;

  > div {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    > * + * {
      margin-top: 8px;
    }
  }

  > div:first-child {
    margin-right: 5px;
  }
  > div:last-child {
    margin-left: 5px;
  }
`;

const CityDetailsPane = props => {
  const { city } = props;
  const mapUrl = `https://www.mapquestapi.com/staticmap/v5/map?key=${MAP_KEY}&locations=${city.name && city.name.split(' ').join('+')},${city.country && city.country.split(' ').join('+')}|marker-sm-2E71F0&zoom=5&type=light&size=500,250@2x`
  return(
    <Container>
      <span style={{'font-size': '20px'}}>This is our recommendation for you</span>
      <CardHead>
        <div>
          <span id="title">{city.name}</span>
          <span id="subtitle">{city.country}</span>
        </div>
      </CardHead>
      <RichContentContainer style={{'height': '100px'}} pictureUrl={city.pictureUrl} mapUrl={mapUrl}>
        <div id="map" style={{'width': '100%'}}></div>
      </RichContentContainer>

      <DetailsContainer>
        <div>
          <InfoBullet label="price level">
            <CostIndicator value={city.costOfLivingIndexBin/5} symbolCount={5} />
          </InfoBullet>
          <InfoBullet label="climate type">
            <SerifBullet>{city.climateType}</SerifBullet>
          </InfoBullet>
          <InfoBullet label="average temperature">
            <TemperatureField>
              <span>{Number(city.averageTemperature).toFixed(1)}°C</span>
              <ProgressBarWithMargin value={city.averageTemperature / 30.0} margin={0} fillColor={'#5D26CF'}/>
            </TemperatureField>
          </InfoBullet>
        </div>
        <div>
          <InfoBullet label="food">
            <MatchLevelIndicator value={city.foodRank/180} symbolCount={10}/>
          </InfoBullet>
          <InfoBullet label="arts and entertainment">
            <MatchLevelIndicator value={city.artsAndEntertainmentRank/180} symbolCount={10}/>
          </InfoBullet>
          <InfoBullet label="outdoors and recreation">
            <MatchLevelIndicator value={city.outdoorsAndRecreationRank/180} symbolCount={10}/>
          </InfoBullet>
          <InfoBullet label="nightlife">
            <MatchLevelIndicator value={city.nightlifeRank/180} symbolCount={10}/>
          </InfoBullet>
        </div>
      </DetailsContainer>
    </Container>
  );
}

export default CityDetailsPane;