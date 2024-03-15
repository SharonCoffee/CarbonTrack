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

  const propertyLabels = {
    PropertyID: 'Property ID',
    CountyName: 'County Name',
    DwellingTypeDescr: 'Dwelling Type',
    Year_of_Construction: 'Year of Construction',
    TypeofRating: 'Type of Rating',
    EnergyRating: 'Energy Rating',
    BerRating: 'BER Rating',
    TotalFloorArea: 'Total Floor Area',
    UValueWall: 'U-Value Wall',
    UValueRoof: 'U-Value Roof',
    UValueFloor: 'U-Value Floor',
    UValueWindow: 'U-Value Window',
    UvalueDoor: 'U-Value Door',
    WallArea: 'Wall Area',
    RoofArea: 'Roof Area',
    FloorArea: 'Floor Area',
    WindowArea: 'Window Area',
    DoorArea: 'Door Area',
    NoStoreys: 'No. of Storeys',
    CO2Rating: 'CO2 Rating'
  };

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
        <div className="form-elements">
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
          <div className="search-button-container">
            <button type="button" className="button-blue" onClick={handleSearch}>Search Properties</button>
          </div>

          {/* Result properties list */}
          {properties && properties.length > 0 && (
              <div>
                <ul className="property-list">
                  {properties.map((property, index) => (
                      <li key={index}>
                        {property.PropertyID}: {property.DwellingTypeDescr} - {property.BerRating}
                        <button type="button" className="button-blue" onClick={() => {
                          setSelectedProperty(property);
                          setIsPropertyConfirmed(false);
                        }}>Select
                        </button>
                      </li>
                  ))}
                </ul>
                <div>
                {selectedProperty && (
                      <div className="property-card">
                        <h3>Selected Property Details:</h3>
                        <ul className="property-details">
                          {Object.keys(selectedProperty)
                            .filter(key => propertyLabels[key]) // Only include keys that are in the mapping
                            .map((key, index) => (
                                  <li key={index}>
                                    <strong>{propertyLabels[key]}:</strong> {selectedProperty[key]}
                                  </li>
                            ))}
                        </ul>
                        <button type="submit" onClick={() => {
                          const confirmSelection = window.confirm('Are you sure this is the correct property?');
                          if (confirmSelection) {
                            setIsPropertyConfirmed(true);
                            navigate('/suggestions', { state: { selectedProperty } });
                          }
                        }} className="button-blue">Confirm Property
                        </button>
                      </div>
                )}
                </div>
              </div>
          )}

        </div>
      </form>
  )
  ;
}

export default BerRatingForm;
