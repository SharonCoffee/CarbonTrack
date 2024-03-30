// TODO
// 4. Import graphing libraries or components as needed
// 5.  Show a button to navigate back to the countymap

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import Papa from 'papaparse';

const Dashboard = () => {
  const navigate = useNavigate(); // Hook to navigate

  const { countyName } = useParams(); // This captures the dynamic part of the URL
  console.log('County Name:', countyName);
  const [data, setData] = useState({});
  const [propertyData, setPropertyData] = useState([]);
  const [grantSupportDataByYear, setGrantSupportDataByYear] = useState([]);
  const [grantSupportEnergyRatingsData, setGrantSupportEnergyRatingsData] = useState([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalEFGProperties, setTotalEFGProperties] = useState(0);
  const [efgPercentage, setEFGPercentage] = useState(0);
  const [totalGrantSupportProperties, setTotalGrantSupportProperties] = useState(0);
  const [totalGrantSupportedEFGProperties, setTotalGrantSupportedEFGProperties] = useState(0);
  const [efgDifferences, setEFGDifferences] = useState([]);
  const [propertiesStillNeedingSupport, setPropertiesStillNeedingSupport] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define your energy rating colors here
  const energyRatingColors = {
    A1: '#008000',
    A2: '#008000',
    A3: '#008000',
    B1: '#3fc43f',
    B2: '#3fc43f',
    B3: '#3fc43f',
    C1: '#eeec20',
    C2: '#eeec20',
    C3: '#eeec20',
    D1: '#FFC300',
    D2: '#FFC300',
    E1: '#e7ac4a',
    E2: '#e7ac4a',
    F: '#ee8908',
    G: '#cc0000'
  };

  function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function sortEnergyRatings (a, b) {
    return a.ratingType.localeCompare(b.ratingType);
  }

  const handleBarClick = (entry) => {
    // Navigate to the EFG properties page with the selected ratingType and countyName
    navigate(`/efgproperties/${entry.ratingType}/${countyName}`);
  };

  // Function to fetch county-specific data
  const fetchDataForCounty = async () => {
    setIsLoading(true);
    try {
      // Fetching CSV data from the server
      const response = await fetch(`/data/data_${countyName}.csv`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if the response is in CSV format
      if (!response.headers.get('Content-Type')?.includes('text/csv')) {
        throw new Error('Did not receive CSV');
      }

      // Reading CSV text
      const csvText = await response.text();
      // Parsing CSV text into JSON using PapaParse
      const parsedData = Papa.parse(csvText, { header: true });

      // Assuming you want to convert parsed CSV data into a specific format for your application
      const formattedData = parsedData.data.map(item => ({
        // Define data structure from CSV fields
        id: item.PropertyID,
        dwellingType: item.DwellingTypeDescr
        // Add more fields as needed
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Fetching county data failed:', error);
      setError(`There was a problem retrieving the data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch Leitrim data
  const fetchCountyData = async () => {
    const selectedCounty = countyName.toLowerCase();
    try {
      const response = await fetch(`/data/data_${selectedCounty}.csv`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvText = await response.text(); // Get CSV text from response
      const parsedData = Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });

      let totalProperties = 0;
      let totalEFGProperties = 0;
      let totalGrantSupportProperties = 0;
      let totalGrantSupportedEFGProperties = 0;

      // Initialize an object to count energy ratings & grant support by year
      const energyRatingsCount = {};
      const grantSupportByYear = {};
      const grantSupportEnergyRatings = {};

      // Iterate over each item in parsed CSV data
      parsedData.data.forEach(item => {
        const rating = item.EnergyRating;
        if (rating) {
          totalProperties++;
          if (['E1', 'E2', 'F', 'G'].includes(rating)) {
            totalEFGProperties++;
          }
          energyRatingsCount[rating] = (energyRatingsCount[rating] || 0) + 1;
        }
        if (item.PurposeOfRating === 'Grant Support') {
          totalGrantSupportProperties++;
          const year = item.DateOfAssessment.slice(-4);
          grantSupportByYear[year] = (grantSupportByYear[year] || 0) + 1;
          const newRating = item.EnergyRating;
          grantSupportEnergyRatings[newRating] = (grantSupportEnergyRatings[newRating] || 0) + 1;

          if (['E1', 'E2', 'F', 'G'].includes(newRating)) {
            totalGrantSupportedEFGProperties++;
          }
          // After fetching and processing data in fetchCountyData
          const differences = ['E1', 'E2', 'F', 'G'].map(rating => ({
            ratingType: rating,
            difference: (energyRatingsCount[rating] || 0) - (grantSupportEnergyRatings[rating] || 0)
          }));
          setEFGDifferences(differences);
        }
      });

      const efgPercentage = totalProperties > 0 ? ((totalEFGProperties / totalProperties) * 100).toFixed(2) : 0;
      // Properties still needing retrofitting
      const propertiesStillNeedingSupport = totalEFGProperties - totalGrantSupportedEFGProperties;

      // Update state with the new data
      setTotalProperties(totalProperties);
      setTotalEFGProperties(totalEFGProperties);
      setEFGPercentage(efgPercentage);
      setTotalGrantSupportProperties(totalGrantSupportProperties);
      setTotalGrantSupportedEFGProperties(totalGrantSupportedEFGProperties);
      setPropertiesStillNeedingSupport(propertiesStillNeedingSupport);
      setPropertyData(Object.keys(energyRatingsCount).map(rating => ({
        ratingType: rating,
        ratingCount: energyRatingsCount[rating]
      })).sort(sortEnergyRatings));
      setGrantSupportDataByYear(Object.keys(grantSupportByYear).map(year => ({
        year,
        count: grantSupportByYear[year]
      })));
      setGrantSupportEnergyRatingsData(Object.keys(grantSupportEnergyRatings).map(rating => ({
        ratingType: rating,
        count: grantSupportEnergyRatings[rating]
      })).sort(sortEnergyRatings));
    } catch (error) {
      console.error('Error fetching or parsing Leitrim data:', error);
    }
  };

  useEffect(() => {
    fetchDataForCounty();
    fetchCountyData();
  }, [countyName]);

  if (data.length === 0) {
    return;
  }

  const renderRetrofitProgress = () => {
    return (
        <BarChart
            width={1000}
            height={400}
            data={propertyData}
            margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
            className="barChart">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ratingType" label={{ value: 'Energy Rating Category', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Number of Properties', angle: -90, position: 'insideLeft', offset: 10 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="ratingCount" name="Energy Rating">
            {
              propertyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={energyRatingColors[entry.ratingType] || '#8884d8'} />
              ))
            }
          </Bar>
        </BarChart>
    );
  };

  const renderGrantSupportYearlyProgress = (data) => {
    return (
        <BarChart
            width={750}
            height={400}
            data={data}
            margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
            className="barChart">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Number of Properties', angle: -90, position: 'insideLeft', offset: 10 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Grant support provided" fill="#4a90e2" />
        </BarChart>
    );
  };

  const renderGrantSupportEnergyRatings = () => {
    return (
        <BarChart
            width={750}
            height={400}
            data={grantSupportEnergyRatingsData}
            margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
            className="barChart">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ratingType" label={{ value: 'Energy Rating Category', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Number of Properties', angle: -90, position: 'insideLeft', offset: 10 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Grant Support by Energy Rating Category" >
            {grantSupportEnergyRatingsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={energyRatingColors[entry.ratingType] || '#8884d8'} />
            ))}
          </Bar>
        </BarChart>
    );
  };

  const renderEFGDifferencesChart = () => {
    return (
        <BarChart
            width={600}
            height={400}
            data={efgDifferences}
            margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
            className="barChart">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ratingType" label={{ value: 'Energy Rating Category', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Number of Properties', angle: -90, position: 'insideLeft', offset: 10 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="difference" name="Difference in Number of Properties" fill="#82ca9d">
            {efgDifferences.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={energyRatingColors[entry.ratingType] || '#8884d8'}
                      onClick={() => handleBarClick(entry)} // Add onClick event here
                />
            ))}
          </Bar>
        </BarChart>
    );
  };

  // Render dashboard UI
  return (
      <>
        <div className="energy-rating-container">
          <br></br>
          <h1>County {capitalizeFirstLetter(countyName)} Dashboard</h1>
          <br></br>
          {isLoading && <p>Loading...</p>}
          {error && <div className="error-message">{error}</div>} {/* Display error message */}
        </div>
        <div className="properties-summary-container">
          <div className="properties-container">
            <h2>Total Properties in {capitalizeFirstLetter(countyName)}</h2>
            <p className="big-number">{totalProperties}</p>
          </div>
          <div className="efg-properties-container">
            <h2>Total Properties with E1, E2, F, or G Ratings</h2>
            <p className="big-number">{totalEFGProperties}</p>
          </div>
          <div className="efg-percentage-container">
            <h2>Percentage of E1, E2, F, or G Rated Properties</h2>
            <p className="big-number">{efgPercentage}%</p>
          </div>
        </div>
        <div className="energy-rating-chart-container">
          <h2>Property Energy Ratings Distribution</h2>
          {propertyData.length > 0 ? renderRetrofitProgress() : <p>No data available.</p>}
        </div>
        <div className="grant-supported-properties-container">
          <h2>Total Grant supports allocated to properties since 2011</h2>
          <p className="big-number">{totalGrantSupportProperties}</p>
        </div>
        <div className="grant-summary-container">
          <div className="retrofit-yearly-chart-container">
            <h2>Grant supports distribution by Year</h2>
            <p>Number of properties per annum that received grant support, irrespective of Energy Rating category.</p>
            {grantSupportDataByYear.length > 0
              ? renderGrantSupportYearlyProgress(grantSupportDataByYear)
              : <p>No property data available.</p>}
          </div>
          <div className="energy-rating-chart-container">
            <h2>Energy Ratings for Grant Support Properties</h2>
            <p>Properties with an E1, E2, F or G Energy Rating category that received grant support.</p>
            {grantSupportEnergyRatingsData.length > 0
              ? renderGrantSupportEnergyRatings()
              : <p>No property data available.</p>}
          </div>
        </div>
        <div className="properties-needing-support-summary">
          <div className="properties-received-support-container">
            <h2>Properties in E1, E2, F and G Energy Rating Category that have received grant support</h2>
            <p className="big-number">{totalGrantSupportedEFGProperties}</p>
          </div>
          <div className="properties-needing-support-container">
            <h2>Properties in E1, E2, F and G Energy Rating Category that still need support</h2>
            <p className="big-number">{propertiesStillNeedingSupport}</p>
          </div>
        </div>
        <div className="efg-differences-chart-container">
          <h2>Distribution of the {propertiesStillNeedingSupport} Properties in E1, E2, F and G Energy Rating Category that still need support</h2>
          <p>Click on each category in the table below to get more detailed information.</p>
          {efgDifferences && efgDifferences.length > 0
            ? renderEFGDifferencesChart()
            : <p>No data available.</p>}
        </div>
      </>
  );
};

export default Dashboard;
