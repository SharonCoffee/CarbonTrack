import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Papa from 'papaparse';

function SuggestionsPage () {
  const location = useLocation();
  const [selectedProperty, setSelectedProperty] = useState(location.state.selectedProperty);
  const [modifiedValues, setModifiedValues] = useState({});

  const handleValueChange = (field, value) => {
    setModifiedValues(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // Assuming you need to fetch new energy ratings based on modified U-values
    fetch('/data/data_building_archetype.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true, // Assuming your CSV has headers
          complete: (result) => {
            console.log(result.data);
            // Do something with the data based on modified U-values
          }
        });
      });
  }, [modifiedValues]); // Rerun when modifiedValues changes

  // Display the selected property and inputs for modifying U-values
  return (
        <div>
            <h1>Selected Property</h1>
            {selectedProperty && (
                <div>
                    <p>Dwelling Type: {selectedProperty.DwellingTypeDescr}</p>
                    <p>Energy Rating: {selectedProperty.EnergyRating}</p>
                    <table>
                        <thead>
                        <tr>
                            <th>UValue Wall</th>
                            <th>UValue Roof</th>
                            <th>UValue Floor</th>
                            <th>UValue Window</th>
                            <th>UValue Door</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{selectedProperty.UValueWall}</td>
                            <td>{selectedProperty.UValueRoof}</td>
                            <td>{selectedProperty.UValueFloor}</td>
                            <td>{selectedProperty.UValueWindow}</td>
                            <td>{selectedProperty.UvalueDoor}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div>
                        <label>Modify Wall U-Value:</label>
                        <input
                            type="number"
                            value={modifiedValues.UValueWall || selectedProperty.UValueWall}
                            onChange={e => handleValueChange('UValueWall', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Modify Roof U-Value:</label>
                        <input
                            type="number"
                            value={modifiedValues.UValueRoof || selectedProperty.UValueRoof}
                            onChange={e => handleValueChange('UValueRoof', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Modify Floor U-Value:</label>
                        <input
                            type="number"
                            value={modifiedValues.UValueFloor || selectedProperty.UValueFloor}
                            onChange={e => handleValueChange('UValueFloor', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Modify Window U-Value:</label>
                        <input
                            type="number"
                            value={modifiedValues.UValueWindow || selectedProperty.UValueWindow}
                            onChange={e => handleValueChange('UValueWindow', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Modify Door U-Value:</label>
                        <input
                            type="number"
                            value={modifiedValues.UvalueDoor || selectedProperty.UvalueDoor}
                            onChange={e => handleValueChange('UvalueDoor', e.target.value)}
                        />
                    </div>
                    {/* Add here any additional logic or display elements */}
                </div>
            )}
        </div>
  );
}

export default SuggestionsPage;
