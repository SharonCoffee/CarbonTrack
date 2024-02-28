import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

function BerRatingForm () {
  const [selectedCounty, setSelectedCounty] = useState('');
  const counties = [
    'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway', 'Kerry',
    'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Louth', 'Longford',
    'Mayo', 'Meath', 'Monaghan', 'Offaly', 'Roscommon', 'Sligo',
    'Tipperary', 'Waterford', 'Westmeath', 'Wexford', 'Wicklow'
  ];

  const [propertyType, setPropertyType] = useState('');
  const propertyTypes = [
    'Apartment',
    'Basement Dwelling',
    'Detached house',
    'End of terrace house',
    'Ground-floor apartment',
    'House',
    'Maisonette',
    'Mid-floor apartment',
    'Mid-terrace house',
    'Semi-detached house',
    'Top-floor apartment'
  ];

  const [constructionYear, setConstructionYear] = useState('');
  // Years range from 1700 to 2023
  const constructionYears = Array.from(new Array(2024 - 1700), (_, index) => 1700 + index);

  const [energyRating, setEnergyRating] = useState('');
  const energyRatings = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'E1', 'E2', 'F', 'G'];

  const [berRating, setBerRating] = useState('');

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isPropertyConfirmed, setIsPropertyConfirmed] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    // CSV is stored in public/data/data_leitrim.csv
    Papa.parse('/data/data_leitrim.csv', {
      download: true,
      header: true,
      complete: (result) => {
        console.log('Parsed data:', result.data);
        const filteredProperties = result.data.filter(property =>
          property.CountyName === selectedCounty &&
          property.DwellingTypeDescr === propertyType &&
          property.Year_of_Construction.toString() === constructionYear &&
          property.EnergyRating === energyRating &&
          property.BerRating.trim() === parseFloat(berRating).toString().trim()
        );
        console.log('Filtered properties:', filteredProperties);
        setProperties(filteredProperties);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProperty && isPropertyConfirmed) {
      navigate('/suggestions', { state: { selectedProperty } });
    } else {
      alert('Please select and confirm a property before submitting.');
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <div>
          <select value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)}>
            <option value="">Select a County</option>
            {counties.map((county, index) => (
                <option key={index} value={county}>{county}</option>
            ))}
          </select>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">Select Property Type</option>
            {propertyTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
            ))}
          </select>
          <select value={constructionYear} onChange={(e) => setConstructionYear(e.target.value)}>
            <option value="">Select Construction Year</option>
            {constructionYears.map((year, index) => (
                <option key={index} value={year}>{year}</option>
            ))}
          </select>
          <select value={energyRating} onChange={(e) => setEnergyRating(e.target.value)}>
            <option value="">Select Energy Rating</option>
            {energyRatings.map((rating, index) => (
                <option key={index} value={rating}>{rating}</option>
            ))}
          </select>
          <input
              type="text"
              value={berRating}
              onChange={(e) => setBerRating(e.target.value)}
              placeholder="Enter BER Rating (e.g., 150.5)"
          />
          <button type="button" onClick={handleSearch}>Search Properties</button>

          {/* Result properties list */}
          {properties && properties.length > 0 && (
              <div>
                <ul>
                  {properties.map((property, index) => (
                      <li key={index}>
                        {property.PropertyID}: {property.DwellingTypeDescr} - {property.BerRating}
                        <button type="button" onClick={() => {
                          setSelectedProperty(property);
                          setIsPropertyConfirmed(false);
                        }}>Select</button>
                      </li>
                  ))}
                </ul>
                {selectedProperty && (
                    <div>
                      <h3>Selected Property Details:</h3>
                      <ul>
                        {Object.keys(selectedProperty)
                          .slice(0, 20) // Adjust the number based on how many columns you want to display
                          .map((key, index) => (
                                <li key={index}>
                                  <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {selectedProperty[key]}
                                </li>
                          ))}
                      </ul>
                      <button type="button" onClick={() => setIsPropertyConfirmed(true)}>Confirm Property</button>
                    </div>
                )}
              </div>
          )}

          <button type="submit">Submit</button>
        </div>
      </form>
  );
}

export default BerRatingForm;
