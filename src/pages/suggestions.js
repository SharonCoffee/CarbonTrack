import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Papa from 'papaparse';

function SuggestionsPage () {
  const location = useLocation();
  const [selectedProperty, setSelectedProperty] = useState(location.state ? location.state.selectedProperty : null);
  const [newEnergyRating, setNewEnergyRating] = useState('');
  const [archetypeData, setArchetypeData] = useState([]);
  const [modifiedValues, setModifiedValues] = useState({});
  const [selectedUValues, setSelectedUValues] = useState({});

  const handleValueChange = (field, value) => {
    setModifiedValues(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // Fetch archetype data once at the start
    fetch('/data/data_building_archetype.csv')
      .then(response => response.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          complete: result => setArchetypeData(result.data)
        });
      });
  }, []);

  const availableRatings = selectedProperty && ['A1', 'A2', 'A3', 'B1', 'B2'].filter(rating => rating !== selectedProperty.EnergyRating && rating < selectedProperty.EnergyRating);

  const thresholdValues = {
    wall: 0.36,
    roof: 0.22,
    floor: 0.34,
    window: 2.10,
    door: 2.05
  };

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

  // Display the selected property and inputs for modifying U-values
  return (
        <div>
            <h1>Selected Property</h1>
            {selectedProperty && (
                <div className="u-values-card">
                  <p><strong>Dwelling Type:</strong> {selectedProperty.DwellingTypeDescr}</p>
                  <p><strong>Current Energy Rating:</strong> {selectedProperty.EnergyRating}</p>
                  <h2>Current U-Values</h2>
                  <table className="u-values-table">
                    <thead>
                    <tr>
                      <th>U-Value Types</th>
                      <th>Existing Value</th>
                      <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <th>Walls UValue</th>
                      <td>{selectedProperty.UValueWall}</td>
                      <td>{selectedProperty.UValueWall > thresholdValues.wall ? 'Your walls are not holding heat well. This could mean your wall insulation is thin, old, or missing. Your home may feel colder and your heating bills may be higher.' : 'Your walls are good at keeping heat inside your home. This means your wall insulation is effective. Your home should feel warmer and your heating bills should be lower..'}</td>
                    </tr>
                    <tr>
                      <th>Roof UValue</th>
                      <td>{selectedProperty.UValueRoof}</td>
                      <td>{selectedProperty.UValueRoof > thresholdValues.roof ? 'Heat is escaping through your roof. This often means your roof insulation is insufficient or absent. Your top floors may be chilly, and heating costs could be high.' : 'Your roof is well insulated, keeping heat from escaping. This helps maintain a comfortable temperature throughout your home and can reduce heating costs.'}</td>
                    </tr>
                    <tr>
                      <th>Floors UValue</th>
                      <td>{selectedProperty.UValueFloor}</td>
                      <td>{selectedProperty.UValueFloor > thresholdValues.floor ? 'Your floors are losing heat, which can make them feel cold underfoot. This usually means there\'s inadequate insulation beneath them. This can lead to colder room temperatures and higher heating bills.' : 'Your floors are effective at retaining heat, which can help keep your feet and room warmer. Good floor insulation contributes to overall warmth and energy efficiency in your home.'}</td>
                    </tr>
                    <tr>
                      <th>Windows UValue</th>
                      <td>{selectedProperty.UValueWindow}</td>
                      <td>{selectedProperty.UValueWindow > thresholdValues.window ? 'Your windows are not very good at keeping heat inside. This could be because they are old, single-glazed, or poorly fitted, leading to drafts and cold spots near windows.' : 'Your windows are doing a good job of keeping heat in. They are likely double or triple-glazed and well-sealed, helping to maintain a comfortable temperature and reduce noise from outside.'}</td>
                    </tr>
                    <tr>
                      <th>Doors UValue</th>
                      <td>{selectedProperty.UvalueDoor}</td>
                      <td>{selectedProperty.UvalueDoor > thresholdValues.door ? 'Your doors allow heat to escape easily, which can make your home feel drafty, particularly near doors. This might mean the doors are old, poorly insulated, or not fitting correctly.' : 'Your doors are well insulated and fitted, helping to keep heat in and cold out. This contributes to a warmer, more energy-efficient home.'}</td>
                    </tr>
                    </tbody>
                  </table>
                  <p></p>
                  <h2>Select New Energy Rating</h2>
                  <p>
                    Choosing a new Energy Rating for your home is a proactive step towards enhancing your living
                    environment and reducing your energy costs.
                    A higher Energy Rating signifies better thermal efficiency, meaning your home retains heat more
                    effectively during winter and stays cooler
                    during summer. This not only improves comfort but also reduces the need for excessive heating or
                    cooling, leading to significant savings on
                    energy bills. Additionally, upgrading your home&apos;s energy performance can increase its market
                    value
                    and reduce its environmental impact
                    by lowering carbon emissions. Select a new Energy Rating below to see how you can achieve these
                    benefits.
                  </p>
                  <select value={newEnergyRating} onChange={e => setNewEnergyRating(e.target.value)}>
                    <option value="">Select New Energy Rating</option>
                    {availableRatings && availableRatings.map(rating => <option key={rating}
                                                                                value={rating}>{rating}</option>)}
                  </select>
                  <button onClick={submitNewEnergyRating} className="button-blue">Submit</button>
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
                            </tr>
                            <tr>
                              <td>External Wall Insulation</td>
                              <td>€16,000</td>
                              <td>€8,000</td>
                              <td>€8,000</td>
                            </tr>
                            <tr>
                              <td>Cavity Wall Insulation</td>
                              <td>€2,200</td>
                              <td>€1,700</td>
                              <td>€500</td>
                            </tr>
                          </>
                      )}
                      {selectedUValues.UValueRoof && (
                          <tr>
                            <td>Roof Insulation</td>
                            <td>€2,000</td>
                            <td>€1,500</td>
                            <td>€500</td>
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
