import React from 'react';
import styled from 'styled-components';
import Checkbox from '../../../../components/Checkbox';
import InfoBullet from '../../../../components/InfoBullet';
import { Card, CardHead, CardBody, SerifBullet } from '../../../../CommonStyles';
import CostIndicator from '../../../../components/CostIndicator';
const MAP_KEY = 'Nbx46lwGXYYiagLOQyuAM8Y9PHBimLAn'

const LeftSideContent = styled.div`
  width: 50%;
`;

const ModifiedCardHead = styled(CardHead)`
    & span#title {
    color: ${p => p.isSelected ? p.theme.darkGreen : p.theme.primaryText};
  }

  & span#subtitle {
    color: ${p => p.isSelected ? p.theme.green : p.theme.secondaryText};
  }
`;

const CityImage = styled.div`
  background-color: #E9EAEE;
  background-image: url(${p => p.pictureUrl});
  background-size: cover;
  height: 100%;
`;

const RightSideContent = styled.div`
  width: 50%;
  min-height: 107px;
  padding: 10px;
  border-top: 1px solid #E9EAEE; 

  > * + * {
    margin-top: 8px;
  }
`;

const MapContentContainer = styled.div`
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

const ModifiedCheckbox = styled(Checkbox)`
  display: inline-block;
  margin-right: 7px;

  ${Card}:hover & {
    background-color: ${p => p.isChecked ? p.theme.checkbox.hover.checked.background : p.theme.checkbox.hover.unchecked.background};
    border: 3px solid ${p => p.isChecked ? p.theme.checkbox.hover.checked.border : p.theme.checkbox.hover.unchecked.border};
  }
`;

const SmallCity = props => {
  const { city, onClick, isSelected } = props;
   const mapUrl = `https://www.mapquestapi.com/staticmap/v5/map?key=${MAP_KEY}&locations=${city.name && city.name.split(' ').join('+')},${city.country && city.country.split(' ').join('+')}|marker-sm-2E71F0&zoom=5&type=light&size=500,250@2x`;

  return (
      <Card onClick={onClick}>
        <ModifiedCardHead isSelected={isSelected}>
          <div>
            <span id="title">{city.name}</span>
            <span id="subtitle">{city.country}</span>
          </div>
          <ModifiedCheckbox isChecked={isSelected} />
        </ModifiedCardHead>

        <CardBody>
          <LeftSideContent>
            <MapContentContainer style={{'height': '100px'}} mapUrl={mapUrl}>
              <div id="map" style={{'width': '100%'}}></div>
            </MapContentContainer>
          </LeftSideContent>
          <RightSideContent>
            <InfoBullet label="price level">
              <CostIndicator value={city.costOfLivingIndexBin/5} symbolCount={5}/>
            </InfoBullet>
            <InfoBullet label="climate type">
              <SerifBullet>{city.climateType}</SerifBullet>
            </InfoBullet>
          </RightSideContent>
        </CardBody>
      </Card>
  );
}

export default SmallCity;