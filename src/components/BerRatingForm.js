import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

function BerRatingForm () {
  const [selectedCounty, setSelectedCounty] = useState('');
  const [currentBerRating, setCurrentBerRating] = useState('');
  const [desiredBerRating, setDesiredBerRating] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const counties = [
    'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway', 'Kerry',
    'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Louth', 'Longford',
    'Mayo', 'Meath', 'Monaghan', 'Offaly', 'Roscommon', 'Sligo',
    'Tipperary', 'Waterford', 'Westmeath', 'Wexford', 'Wicklow'
  ];

  const berRatings = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'E1', 'E2', 'F', 'G'];

  const [propertyType, setPropertyType] = useState(''); // New state for property type

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

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCounty) {
      const storage = getStorage();
      const pathReference = ref(storage, `graphs/${selectedCounty}.png`);

      getDownloadURL(pathReference)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
        });
    }
  }, [selectedCounty]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you would gather the data from the form, for example:
    const formData = {
      county: selectedCounty,
      currentRating: currentBerRating,
      desiredRating: desiredBerRating,
      propertyType
    // Add other form data as needed
    };

    try {
      const response = await fetch('http://localhost:8000/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Ensure formData is passed here
      });
      const data = await response.json();
      navigate('/suggestions', { state: { data } });
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  // Dynamically filter desired BerRatings based on the current selection
  const getFilteredDesiredBerRatings = () => {
    const currentIndex = berRatings.indexOf(currentBerRating);
    const maxDesiredIndex = berRatings.indexOf('D2'); // Index of 'D2' rating
    // Determine if the current rating is 'E1' or higher
    const isCurrentRatingBeyondD2 = currentIndex > maxDesiredIndex;

    // If current rating is 'E1', 'E2', 'F', or 'G', limit desired ratings up to 'D2'
    if (isCurrentRatingBeyondD2) {
      return berRatings.slice(0, maxDesiredIndex + 1); // Include up to 'D2'
    }

    // For all other ratings, include up to the current rating
    return berRatings.slice(0, currentIndex);
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

          <select value={currentBerRating} onChange={(e) => setCurrentBerRating(e.target.value)}>
            <option value="">Select Current BerRating</option>
            {berRatings.map((rating, index) => (
                <option key={index} value={rating}>{rating}</option>
            ))}
          </select>

          {currentBerRating && (
              <select value={desiredBerRating} onChange={(e) => setDesiredBerRating(e.target.value)}>
                <option value="">Select Desired BerRating</option>
                {getFilteredDesiredBerRatings().map((rating, index) => (
                    <option key={index} value={rating}>{rating}</option>
                ))}
              </select>
          )}

          {currentBerRating && desiredBerRating && <button type="submit">Submit</button>}

          {imageUrl && <img src={imageUrl} alt={`BER Rating for ${selectedCounty}`}/>}
        </div>
      </form>
  );
}

export default BerRatingForm;
