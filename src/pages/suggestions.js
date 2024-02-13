import React from 'react';
import { useLocation } from 'react-router-dom';

const SuggestionsPage = () => {
  const location = useLocation();
  // Assuming `suggestions` is the data you want to use
  const { selectedCounty, currentBerRating, desiredBerRating, squareMeters } = location.state;

  // Use the variables to fetch data or display them
  console.log(selectedCounty, currentBerRating, desiredBerRating, squareMeters);

  // Replace 'data' with actual data or state variable
  // const data = ...

  return (
        <div>
            <h1>Suggestions for Improvement</h1>
            {/* Render your suggestions here */}
            {/* Replace 'data' with the actual data variable you intend to use */}
            {/* {data.map((suggestion, index) => (
        <div key={index}>
          <p>{suggestion.description}</p>
          <p>Estimated cost: {suggestion.costPerSqm}</p>
          {/* Render additional suggestion details */}
            {/* </div>
      ))} */}
        </div>
  );
};

export default SuggestionsPage;
