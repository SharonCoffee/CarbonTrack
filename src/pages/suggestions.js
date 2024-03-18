import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Papa from 'papaparse';

function SuggestionsPage () {
  const location = useLocation();
  const selectedProperty = location.state ? location.state.selectedProperty : null;
  const selectedDwellingType = useState('');
  const [newEnergyRating, setNewEnergyRating] = useState('');
  const [archetypeData, setArchetypeData] = useState([]);
  const [modifiedValues, setModifiedValues] = useState({});
  const [selectedUValues, setSelectedUValues] = useState({});

  const handleValueChange = (field, value) => {
    setModifiedValues(prev => ({ ...prev, [field]: value }));
  };

  const availableRatings = selectedProperty && ['A1', 'A2', 'A3', 'B1', 'B2'].filter(rating => rating !== selectedProperty.EnergyRating && rating < selectedProperty.EnergyRating);

  const [thresholdValues, setThresholdValues] = useState({
    wall: 0, // Default values, will be updated dynamically
    roof: 0,
    floor: 0,
    window: 0,
    door: 0
  });

  const improvementCosts = {
    UValueWall: 5000, // example costs in currency units
    UValueRoof: 4000,
    UValueFloor: 3000,
    UValueWindow: 2000,
    UValueDoor: 1000
  };

  const availableGrants = {
    UValueWall: 2000, // example grant amounts in currency units
    UValueRoof: 1500,
    UValueFloor: 1000,
    UValueWindow: 500,
    UValueDoor: 250
  };

  const handleUValueChange = (e, field) => {
    setSelectedUValues({ ...selectedUValues, [field]: e.target.checked });
  };

  const submitNewUValues = () => {
    // Logic to calculate predicted results based on new U-values
    console.log('New U-Values submitted:', selectedUValues);
    // You might want to set some results state here based on the new U-values
  };

  const submitNewEnergyRating = () => {
    // Logic to calculate predicted results based on new U-values
    console.log('New U-Values submitted:', selectedUValues);
    // You might want to set some results state here based on the new U-values
  };

  useEffect(() => {
    // Scrolls the window to the top of the new page
    window.scrollTo(0, 0);

    // Fetch archetype data once at the start or when the selected property changes
    fetch('/data/data_building_archetype.csv')
      .then(response => response.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          complete: result => {
            // Set the full dataset (if you need to use it elsewhere)
            setArchetypeData(result.data);

            // Assuming selectedDwellingType holds type like 'Semi-detached house'
            const dwellingType = selectedProperty ? selectedProperty.DwellingTypeDescr : '';
            const newRating = newEnergyRating;

            // Find matching row for new energy rating and dwelling type
            const matchedRow = result.data.find(row =>
              row.DwellingType === dwellingType && row.EnergyRating === newRating);

            // If a matching row is found, update the threshold values
            if (matchedRow) {
              setThresholdValues({
                wall: parseFloat(matchedRow.UValueWallMean),
                roof: parseFloat(matchedRow.UValueRoofMean),
                floor: parseFloat(matchedRow.UValueFloorMean),
                window: parseFloat(matchedRow.UValueWindowMean),
                door: parseFloat(matchedRow.UValueDoorMean)
              });
            }
          }
        });
      });
  }, [selectedProperty, newEnergyRating]); // Ensure useEffect is triggered when these values change

  // Display the selected property and inputs for modifying U-values
  return (
        <div>
            <h1>Selected Property</h1>
            {selectedProperty && (
                <div className="u-values-card">
                  <p><strong>Dwelling Type:</strong> {selectedProperty.DwellingTypeDescr}</p>
                  <p><strong>Current Energy Rating:</strong> {selectedProperty.EnergyRating}</p>
                  <p></p>
                  <h2>Select New Energy Rating</h2>
                  <p>
                    Choosing a new Energy Rating for your home is a proactive step towards enhancing your living
                    environment and reducing your energy costs.
                  </p>
                  <p>
                    A higher Energy Rating signifies better thermal efficiency, meaning your home retains heat more
                    effectively during winter and stays cooler during summer.
                  </p>
                  <p>
                    This not only improves comfort but also reduces the need for excessive heating or
                    cooling, leading to significant savings on energy bills.
                  </p>
                  <p>
                    Additionally, upgrading your home&apos;s energy performance can increase its market
                    value and reduce its environmental impact by lowering carbon emissions.
                  </p>
                  <p>
                    Select a new Energy Rating below to see how you can achieve these benefits.
                  </p>
                  <select value={newEnergyRating} onChange={e => setNewEnergyRating(e.target.value)}>
                    <option value="">Select New Energy Rating</option>
                    {availableRatings && availableRatings.map(rating => <option key={rating}
                                                                                value={rating}>{rating}</option>)}
                  </select>
                  <button onClick={submitNewEnergyRating} className="button-blue">Submit</button>
                  <h2>Current U-Values</h2>
                  <table className="u-values-table">
                    <thead>
                    <tr>
                      <th>U-Value Types</th>
                      <th>Target U-Values</th>
                      <th>Existing U-Values</th>
                      <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <th>Walls UValue</th>
                      <td>{thresholdValues.wall}</td>
                      <td className={`value-cell ${selectedProperty.UValueWall - thresholdValues.wall > 0.01 ? 'u-value-high' : selectedProperty.UValueWall - thresholdValues.wall < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                        {selectedProperty.UValueWall}
                      </td>
                      <td className={`${selectedProperty.UValueWall - thresholdValues.wall > 0.01 ? 'u-value-high' : selectedProperty.UValueWall - thresholdValues.wall < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                        {selectedProperty.UValueWall - thresholdValues.wall > 0.01
                          ? 'Your walls are not holding heat well. Consider upgrading insulation.'
                          : selectedProperty.UValueWall - thresholdValues.wall < -0.01
                            ? 'Your walls are well insulated against heat loss.'
                            : 'Your walls meet the minimum standard, but improvements could still be beneficial.'}
                      </td>
                    </tr>
                    <tr>
                      <th>Roof UValue</th>
                      <td>{thresholdValues.roof}</td>
                      <td className={`value-cell ${selectedProperty.UValueRoof - thresholdValues.roof > 0.01 ? 'u-value-high' : selectedProperty.UValueRoof - thresholdValues.roof < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                        {selectedProperty.UValueRoof}
                      </td>
                      <td className={`${selectedProperty.UValueRoof - thresholdValues.roof > 0.01 ? 'u-value-high' : selectedProperty.UValueRoof - thresholdValues.roof < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                        {selectedProperty.UValueRoof > thresholdValues.roof
                          ? 'Heat is escaping through your roof. Consider upgrading insulation.'
                          : selectedProperty.UValueRoof === thresholdValues.roof
                            ? 'Your roof meets the minimum standard, but improvements could still be beneficial.'
                            : 'Your roof is well insulated against heat loss.'}
                      </td>
                    </tr>
                    <tr>
                      <th>Floors UValue</th>
                      <td>{thresholdValues.floor}</td>
                      <td className={`value-cell ${selectedProperty.UValueFloor - thresholdValues.floor > 0.01 ? 'u-value-high' : selectedProperty.UValueFloor - thresholdValues.floor < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                        {selectedProperty.UValueFloor}
                      </td>
                      <td className={`${selectedProperty.UValueFloor - thresholdValues.floor > 0.01 ? 'u-value-high' : selectedProperty.UValueFloor - thresholdValues.floor < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                        {selectedProperty.UValueFloor > thresholdValues.floor
                          ? 'Your floors are losing heat, consider improving insulation.'
                          : selectedProperty.UValueFloor === thresholdValues.floor
                            ? 'Your floors meet the standard, but consider enhancements for better warmth.'
                            : 'Your floors are retaining heat efficiently.'}
                      </td>
                    </tr>
                    <tr>
                      <th>Windows UValue</th>
                      <td>{thresholdValues.window}</td>
                      <td className={`value-cell ${selectedProperty.UValueWindow - thresholdValues.window > 0.01 ? 'u-value-high' : selectedProperty.UValueWindow - thresholdValues.window < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                        {selectedProperty.UValueWindow}
                      </td>
                      <td className={`${selectedProperty.UValueWindow - thresholdValues.window > 0.01 ? 'u-value-high' : selectedProperty.UValueWindow - thresholdValues.window < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                        {selectedProperty.UValueWindow > thresholdValues.window
                          ? 'Your windows are not keeping heat in effectively. Consider updating them.'
                          : selectedProperty.UValueWindow === thresholdValues.window
                            ? 'Your windows are adequate, but newer models could offer more savings.'
                            : 'Your windows are performing well in retaining heat.'}
                      </td>
                    </tr>
                    <tr>
                      <th>Doors UValue</th>
                      <td>{thresholdValues.door}</td>
                      <td className={`value-cell ${selectedProperty.UvalueDoor - thresholdValues.door > 0.01 ? 'u-value-high' : selectedProperty.UvalueDoor - thresholdValues.door < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                        {selectedProperty.UvalueDoor}
                      </td>
                      <td className={`${selectedProperty.UvalueDoor - thresholdValues.door > 0.01 ? 'u-value-high' : selectedProperty.UvalueDoor - thresholdValues.door < -0.01 ? 'u-value-low' : 'u-value-medium'}`}>
                        {selectedProperty.UvalueDoor > thresholdValues.door
                          ? 'Your doors are not insulating well. Consider replacements or sealing gaps.'
                          : selectedProperty.UvalueDoor === thresholdValues.door
                            ? 'Your doors meet the current standard, yet there might be room for improvement.'
                            : 'Your doors are well-sealed and insulated.'}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <h2>Select U-Values to Modify</h2>
                  <div>
                    <label>
                      <input type="checkbox" checked={!!selectedUValues.UValueWall}
                             onChange={(e) => handleUValueChange(e, 'UValueWall')}/>
                      Wall
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="checkbox" checked={!!selectedUValues.UValueRoof}
                             onChange={(e) => handleUValueChange(e, 'UValueRoof')}/>
                      Roof
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="checkbox" checked={!!selectedUValues.UValueFloor}
                             onChange={(e) => handleUValueChange(e, 'UValueFloor')}/>
                      Floor
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="checkbox" checked={!!selectedUValues.UValueWindow}
                             onChange={(e) => handleUValueChange(e, 'UValueWindow')}/>
                      Window
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="checkbox" checked={!!selectedUValues.UValueDoor}
                             onChange={(e) => handleUValueChange(e, 'UValueDoor')}/>
                      Door
                    </label>
                  </div>

                  <div className="u-values-card">
                    <h2>Improvement Estimates</h2>
                    <table className="u-values-table">
                      <thead>
                      <tr>
                        <th>Improvement</th>
                        <th>Estimated Works Cost</th>
                        <th>Available SEAI Grant</th>
                        <th>Estimated Cost to Homeowner</th>
                        <th>Apply for Grant</th>
                      </tr>
                      </thead>
                      <tbody>
                      {selectedUValues.UValueWall && (
                          <>
                            <tr>
                              <td>Internal Wall Insulation</td>
                              <td>€9,000</td>
                              <td>€4,500</td>
                              <td>€4,500</td>
                              <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/"
                                     target="_blank" rel="noopener noreferrer" className="button-blue">Apply</a></td>
                            </tr>
                            <tr>
                              <td>External Wall Insulation</td>
                              <td>€16,000</td>
                              <td>€8,000</td>
                              <td>€8,000</td>
                              <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/"
                                     target="_blank" rel="noopener noreferrer" className="button-blue">Apply</a></td>
                            </tr>
                            <tr>
                              <td>Cavity Wall Insulation</td>
                              <td>€2,200</td>
                              <td>€1,700</td>
                              <td>€500</td>
                              <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/"
                                     target="_blank" rel="noopener noreferrer" className="button-blue">Apply</a></td>
                            </tr>
                          </>
                      )}
                      {selectedUValues.UValueRoof && (
                          <tr>
                            <td>Roof/Attic Insulation</td>
                            <td>€2,000</td>
                            <td>€1,500</td>
                            <td>€500</td>
                            <td><a href="https://www.seai.ie/grants/home-energy-grants/insulation-grants/"
                                   target="_blank" rel="noopener noreferrer" className="button-blue">Apply</a></td>
                          </tr>
                      )}
                      {/* Repeat similar structures for UValueFloor, UValueWindow, UValueDoor if necessary */}
                      </tbody>
                    </table>
                    {/* You can add additional instructions or information below the table */}
                  </div>

                </div>
            )}
        </div>
  );
}

export default SuggestionsPage;
