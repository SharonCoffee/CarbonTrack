import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Papa from 'papaparse';

const EFGProperties = () => {
  const navigate = useNavigate();
  const { ratingType, countyName } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [dwellingData, setDwellingData] = useState([]);
  const [uValues, setUValues] = useState([]);

  function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const generateCampaignMessage = (data) => {
    const needsAttention = data.some(item =>
      Object.values(item).some(val => val.color === 'red')
    );
    const noNeedForCampaign = data.every(item =>
      Object.values(item).some(val => val.color === 'green')
    );

    if (needsAttention) {
      return 'There are UValues for Dwelling Types that require attention. Tailored campaigns should be developed for residential properties with any red UValues to encourage retrofitting and improvements.';
    } else if (noNeedForCampaign) {
      return 'There are UValues for specific Dwelling Types that are performing well in terms of energy efficiency. It may not be necessary to tailor campaigns for these properties at this time.';
    } else {
      return 'Review the UValues for each dwelling type. Tailored campaigns may be necessary for specific areas needing improvement.';
    }
  };

  const handleBackToDashboard = () => {
    navigate(`/dashboard/${countyName.toLowerCase()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const countyDataResponse = await fetch(`/data/efg_uvalues_${countyName}.csv`);
        const archetypeDataResponse = await fetch('/data/data_building_archetype.csv');
        if (!countyDataResponse.ok || !archetypeDataResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const [countyCsvText, archetypeCsvText] = await Promise.all([
          countyDataResponse.text(),
          archetypeDataResponse.text()
        ]);

        const parsedCountyData = Papa.parse(countyCsvText, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
        setUValues(parsedCountyData);

        const parsedArchetypeData = Papa.parse(archetypeCsvText, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;

        const a1ArchetypeData = parsedArchetypeData.filter(item => item.EnergyRating === 'A1');

        const MIN_VALID_ARCHETYPE_VALUE = 0.01; // Define a threshold for valid archetype values

        const getColor = (itemValue, archetypeValue) => {
          // If archetype value is below a certain threshold, treat as insufficient data
          if (archetypeValue < MIN_VALID_ARCHETYPE_VALUE) {
            return 'red'; // Indicating lack of comparison baseline
          }

          if (itemValue > archetypeValue) return 'red';
          if (itemValue < archetypeValue) return 'green';
          return 'amber'; // Assuming equality means 'amber' or consider another logic for equality
        };

        // Example usage within your mapping logic
        const enhancedData = parsedCountyData
          .filter(item => item.EnergyRating === ratingType)
          .map(item => {
            const archetype = a1ArchetypeData.find(a => a.DwellingType === item.DwellingTypeDescr && a.EnergyRating === 'A1');

            return {
              ...item,
              UValueWallColor: getColor(item.UValueWallMean, archetype?.UValueWallMean),
              UValueRoofColor: getColor(item.UValueRoofMean, archetype?.UValueRoofMean),
              UValueFloorColor: getColor(item.UValueFloorMean, archetype?.UValueFloorMean),
              UValueWindowColor: getColor(item.UValueWindowMean, archetype?.UValueWindowMean),
              UValueDoorColor: getColor(item.UValueDoorMean, archetype?.UValueDoorMean)
            };
          });

        setDwellingData(enhancedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ratingType, countyName]);

  if (isLoading) return <div>Loading...</div>;

  const campaignMessage = generateCampaignMessage(uValues);

  return (
      <>
        <div className="average-container">
          <h2>Average UValues for {ratingType} Rated Properties in County {capitalizeFirstLetter(countyName)} </h2>
          <p>{campaignMessage}</p>
          <table className="average-table">
            <thead>
            <tr>
              <th>Dwelling Type</th>
              <th>UValue Wall</th>
              <th>UValue Roof</th>
              <th>UValue Floor</th>
              <th>UValue Window</th>
              <th>UValue Door</th>
            </tr>
            </thead>
            <tbody>
            {dwellingData.map((item, index) => (
                <tr key={index}>
                  <td>{item.DwellingTypeDescr}</td>
                  <td className={item.UValueWallColor}>{item.UValueWallMean}</td>
                  <td className={item.UValueRoofColor}>{item.UValueRoofMean}</td>
                  <td className={item.UValueFloorColor}>{item.UValueFloorMean}</td>
                  <td className={item.UValueWindowColor}>{item.UValueWindowMean}</td>
                  <td className={item.UValueDoorColor}>{item.UValueDoorMean}</td>
                </tr>
            ))}
            </tbody>
          </table>
          <div>
            <button className="button-blue" onClick={handleBackToDashboard}>Select New Energy Rating</button>
          </div>
        </div>
      </>

  );
};

export default EFGProperties;
