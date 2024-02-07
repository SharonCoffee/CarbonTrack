import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

function BerRatingForm () {
  const [selectedCounty, setSelectedCounty] = useState('');
  const [currentBerRating, setCurrentBerRating] = useState('');
  const [desiredBerRating, setDesiredBerRating] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const counties = [
    'Leitrim', 'Longford', 'Monaghan', 'Offaly', 'Roscommon', 'Sligo',
    'Tipperary', 'Waterford', 'Westmeath', 'Wexford', 'Wicklow', 'Limerick',
    'Louth', 'Mayo', 'Meath', 'Kildare', 'Kilkenny', 'Laois', 'Carlow',
    'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway', 'Kerry'
  ];

  // Sort counties in alphabetical order
  counties.sort();

  const berRatings = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'E1', 'E2', 'F', 'G'];
  // Filter desired BerRatings based on current selection (up to D2)
  const desiredBerRatings = berRatings.slice(0, berRatings.indexOf('D3'));

  useEffect(() => {
    if (selectedCounty) {
      const storage = getStorage();
      // Update path according to your storage structure
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

  return (
      <div>
        <select value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)}>
          <option value="">Select a County</option>
          {counties.map((county, index) => (
              <option key={index} value={county}>{county}</option>
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
              {desiredBerRatings.map((rating, index) => {
                if (berRatings.indexOf(rating) <= berRatings.indexOf(currentBerRating)) {
                  return <option key={index} value={rating}>{rating}</option>;
                }
                return null;
              })}
            </select>
        )}

        {imageUrl && <img src={imageUrl} alt={`BER Rating for ${selectedCounty}`} />}
      </div>
  );
}

export default BerRatingForm;
