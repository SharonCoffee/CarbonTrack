// TODO
// 3. Add a button that returns the policy maker to the home page/ Log them out.

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import irelandGeodata from '@amcharts/amcharts5-geodata/irelandLow';

const Countymap = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate('/login'); // Redirect to login page after logout
    }).catch((error) => {
      // An error happened.
      console.error('Logout Error:', error);
    });
  };

  useEffect(() => {
    const root = am5.Root.new('chartdiv');

    // Create a map chart
    const chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: 'translateX',
      panY: 'translateY',
      projection: am5map.geoMercator()
    }));

    // Create polygon series for map polygons
    const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: irelandGeodata,
      valueField: 'value',
      calculateAggregates: true
    }));

    // Set the initial fill color for the polygons
    const template = polygonSeries.mapPolygons.template;
    template.setAll({
      tooltipText: '{name}',
      interactive: true,
      fill: am5.color(0xCCCCCC) // Grey color
    });

    // Define hover state and its properties directly for changing color on hover
    template.states.create('hover', { properties: { fill: am5.color(0x1E90FF) } }); // Blue color on hover

    // Add click event for navigation
    polygonSeries.mapPolygons.template.events.on('click', function (ev) {
      const countyName = ev.target.dataItem.dataContext.name;
      navigate(`/dashboard_${countyName.toLowerCase()}`);
    });

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [navigate]);

  return (
      <>
          <div>
              {/* Logout Button */}
              <button type="button" className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
          <div>
              <h1>Overview</h1>
              <p></p>
          </div>
          <div className="policy-container">
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
              <div>
                  <h2>County Map</h2>
                  <p>Click on a county to view the dashboard.</p>
              </div>
              <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
          </div>

      </>
  );
};

export default Countymap;
