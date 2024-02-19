import React from 'react';
import { useLocation } from 'react-router-dom';

const SuggestionsPage = () => {
  const location = useLocation();
  const suggestions = location.state?.suggestions || []; // Use optional chaining and provide a default empty array

  return (
        <div>
            <h1>Suggestions for Improvement</h1>
            {/* Render your suggestions here */}
            <div>
                {suggestions.map((suggestion, index) => (
                    <div key={index}>
                        <p>{suggestion.description}</p>
                        <p>Estimated cost: {suggestion.costPerSqm}</p>
                        {/* Render additional suggestion details */}
                    </div>
                ))}
            </div>
        </div>
  );
};

export default SuggestionsPage;
