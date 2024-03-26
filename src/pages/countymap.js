// TODO
// 3. Add a button that returns the policy maker to the home page/ Log them out.

import React from 'react';
import { useNavigate } from 'react-router-dom';
// import mapData from '../assets/irelandLow.js';
import { ReactComponent as IrelandMap } from '../assets/irelandLow.svg';

// Example positions, replace with actual positions for each county
const counties = [
  { name: 'Dublin', top: '50px', left: '100px', width: '20px', height: '20px' },
  { name: 'Cork', top: '150px', left: '80px', width: '20px', height: '20px' }
  // Add other counties
];

const Countymap = () => {
  const navigate = useNavigate();

  const handleNavigate = (county) => {
    navigate(`/dashboard_${county.name.toLowerCase()}`);
  };

  return (
      <>
          <div>
              <h1>County Map</h1>
              <p></p>
          </div>
          <div className="policy-container">
              <h2>Overview</h2>
              <p>
                  Our interactive map provides a detailed view of the energy efficiency landscape across various
                  counties.
                  Designed specifically for policymakers and environmental strategists, this feature allows you to click
                  on any county to access a specialized dashboard.
                  Each county&apos;s dashboard offers a comprehensive analysis of retrofitting activities,
                  grant distribution, and overall energy performance improvements specific to that area.
                  Explore the map to gain insights and inform your strategic decisions in promoting sustainable energy
                  practices within your jurisdiction.
              </p>
              {/* Similar changes for other sections */}
              <div className="ireland-map-container">
                  <IrelandMap/>
                  {counties.map((county) => (
                      <button
                          key={county.name}
                          style={{ top: county.top, left: county.left, width: county.width, height: county.height }}
                          className="county-overlay"
                          onClick={() => handleNavigate(county)}
                      />
                  ))}
              </div>
          </div>

      </>
  );
};

export default Countymap;
