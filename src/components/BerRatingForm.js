import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

function BerRatingForm () {
  const [selectedCounty, setSelectedCounty] = useState('');
  const csvFilePath = `/data/data_${selectedCounty.toLowerCase()}.csv`;
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
  const [berRatingError, setBerRatingError] = useState(''); // For BER rating validation error message

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

  // Validation function for BER Rating
  const validateBerRating = () => {
    if (!berRating.match(/^\d+(\.\d+)?$/)) {
      setBerRatingError('Invalid BER Rating. Please enter a number. If decimal, use a dot (e.g., 150.50)');
      return false;
    }
    setBerRatingError('');
    return true;
  };

  const handleBerRatingChange = (e) => {
    setBerRating(e.target.value);
  };

  const handleSearch = () => {
    // Ensure BER Rating is valid before searching
    if (!validateBerRating()) return;

    // CSV is stored in public/data/data_countyname.csv
    Papa.parse(csvFilePath, {
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

  const confirmPropertyAndNavigate = () => {
    const confirmSelection = window.confirm('Are you sure this is the correct property?');
    if (confirmSelection) {
      setIsPropertyConfirmed(true);
      navigate('/suggestions', { state: { selectedProperty } });
      // Optionally, place window.scrollTo(0, 0); because the page may not scroll to the top automatically,
      window.scrollTo(0, 0);
      // tried to manage this in the navigated-to page, but it continued to scroll to the top when states where changed in the navigated-to page.
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProperty || !isPropertyConfirmed) {
      alert('Please select and confirm a property before submitting.');
      return;
    }
    navigate('/suggestions', { state: { selectedProperty } });
  };

  return (
      <>
        <form onSubmit={handleSubmit}>
          <div className="form-elements">
            <p>Please fill out this form with details from your latest Building Energy Rating (BER) certificate.</p>
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
                onChange={handleBerRatingChange}
                onBlur={validateBerRating} // Validate when user leaves the input field
                placeholder="Enter BER Rating (e.g., 150.50)"
            />
            {berRatingError && <div className="error-message">{berRatingError}</div>}
            <div className="search-button-container">
              <button type="button" className="button-blue" onClick={handleSearch}>Search Properties</button>
            </div>
          </div>
        </form>

        {/* Result properties list */}
        {properties && properties.length > 0 && (
            <div className="properties-container">
              <h3>Properties Found</h3>
              <table className="properties-table">
                <thead>
                <tr>
                  <th>Property ID</th>
                  <th>Dwelling Type</th>
                  <th>Year of Construction</th>
                  <th>Energy Rating</th>
                  <th>BER Rating</th>
                  <th>Select</th>
                </tr>
                </thead>
                <tbody>
                {properties.map((property, index) => (
                    <tr key={index}>
                      <td>{property.PropertyID}</td>
                      <td>{property.DwellingTypeDescr}</td>
                      <td>{property.Year_of_Construction}</td>
                      <td>{property.EnergyRating}</td>
                      <td>{property.BerRating}</td>
                      <td>
                        <button type="button" className="button-blue" onClick={() => {
                          setSelectedProperty(property);
                          setIsPropertyConfirmed(false);
                        }}>Select
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
              <div>
                {selectedProperty && (
                    <div className="property-select-card">
                      <h3>Selected Property Details</h3>
                      <ul className="property-details">
                        {Object.keys(selectedProperty)
                          .filter(key => propertyLabels[key]) // Only include keys that are in the mapping
                          .map((key, index) => (
                                <li key={index}>
                                  <strong>{propertyLabels[key]}:</strong> {selectedProperty[key]}
                                </li>
                          ))}
                      </ul>
                      <button type="submit" onClick={confirmPropertyAndNavigate} className="button-blue">Confirm Property</button>
                    </div>
                )}
              </div>

            </div>

        )}
      </>
  );
}

export default BerRatingForm;
